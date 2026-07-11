import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ClassFormFields, type ClassFormState } from "@/components/Dashboard/Classes/ClassFormFields";
import type { SearchableOption } from "@/components/Dashboard/Classes/SearchableSelect";
import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { useClassesStore } from "@/services/classes/classes.store";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const initialForm: ClassFormState = {
  courseId: null,
  teacherId: null,
  roomId: null,
  name: "",
  code: "",
  classType: "offline",
  maxStudents: 20,
  startDate: null,
  status: "planned",
};

export default function DashboardClassCreatePage() {
  const navigate = useNavigate();
  const { createClass } = useClassesStore();
  const { courses, listCourses } = useCoursesStore();
  const { teachers, listTeachers } = useTeachersStore();
  const { rooms, listRooms } = useRoomsStore();
  const [form, setForm] = useState<ClassFormState>(initialForm);

  useEffect(() => {
    void listCourses({ page: 1, page_size: 100, mode: "center", status: "active" }).catch(() => toast.error("Không thể tải danh sách khóa học"));
    void listTeachers({ page: 1, page_size: 100 }).catch(() => toast.error("Không thể tải danh sách giáo viên"));
    void listRooms({ page: 1, page_size: 100, status: "active" }).catch(() => toast.error("Không thể tải danh sách phòng học"));
  }, [listCourses, listTeachers, listRooms]);

  const courseOptions = useMemo<SearchableOption[]>(() => courses.map((course) => ({ value: course.id, label: course.name, description: course.code })), [courses]);
  const teacherOptions = useMemo<SearchableOption[]>(() => teachers.map((teacher) => ({ value: teacher.id, label: teacher.user.full_name, description: teacher.user.email })), [teachers]);
  const roomOptions = useMemo<SearchableOption[]>(() => rooms.map((room) => ({ value: room.id, label: room.name, description: room.location })), [rooms]);

  const handleSubmit = async () => {
    if (!form.courseId) {
      toast.error("Vui lòng chọn khóa học");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }

    try {
      const created = await createClass({
        course_id: form.courseId,
        teacher_id: form.teacherId,
        room_id: form.roomId,
        name: form.name.trim(),
        code: form.code.trim() || null,
        class_type: form.classType,
        max_students: form.maxStudents,
        start_date: form.startDate ? form.startDate.toISOString().slice(0, 10) : null,
        status: form.status,
      });
      toast.success("Tạo lớp học thành công");
      navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", created.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tạo lớp học thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tạo lớp học" description="Thêm lớp học mới" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <ClassFormFields value={form} courseOptions={courseOptions} teacherOptions={teacherOptions} roomOptions={roomOptions} onChange={setForm} />
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button><Button onClick={() => void handleSubmit()}>Lưu</Button></div>
      </div>
    </section>
  );
}
