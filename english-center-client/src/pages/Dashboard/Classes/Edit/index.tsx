import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ClassFormFields, type ClassFormState } from "@/components/Dashboard/Classes/ClassFormFields";
import { ClassSessionsTab } from "@/components/Dashboard/Classes/ClassSessionsTab";
import { ClassStudentsTab } from "@/components/Dashboard/Classes/ClassStudentsTab";
import type { SearchableOption } from "@/components/Dashboard/Classes/SearchableSelect";
import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { useClassesStore } from "@/services/classes/classes.store";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const emptyForm: ClassFormState = {
  courseId: null,
  teacherId: null,
  roomId: null,
  name: "",
  code: "",
  classType: "offline",
  maxStudents: 20,
  startDate: "",
  status: "planned",
};

export default function DashboardClassEditPage() {
  const { classId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedClass, getClass, updateClass, deleteClass, clearSelectedClass } = useClassesStore();
  const { courses, listCourses } = useCoursesStore();
  const { teachers, listTeachers } = useTeachersStore();
  const { rooms, listRooms } = useRoomsStore();
  const [form, setForm] = useState<ClassFormState>(emptyForm);
  const [activeTab, setActiveTab] = useState<"sessions" | "students">("sessions");

  useEffect(() => {
    void listCourses({ page: 1, page_size: 100, mode: "center" }).catch(() => toast.error("Không thể tải danh sách khóa học"));
    void listTeachers({ page: 1, page_size: 100 }).catch(() => toast.error("Không thể tải danh sách giáo viên"));
    void listRooms({ page: 1, page_size: 100, status: "active" }).catch(() => toast.error("Không thể tải danh sách phòng học"));
  }, [listCourses, listTeachers, listRooms]);

  useEffect(() => {
    if (!classId) return;
    void getClass(classId).then((item) => {
      setForm({
        courseId: item.course_id,
        teacherId: item.teacher_id,
        roomId: item.room_id,
        name: item.name,
        code: item.code ?? "",
        classType: item.class_type,
        maxStudents: item.max_students,
        startDate: item.start_date ?? "",
        status: item.status,
      });
    }).catch(() => toast.error("Không thể tải lớp học"));
    return () => clearSelectedClass();
  }, [classId, getClass, clearSelectedClass]);

  const courseOptions = useMemo<SearchableOption[]>(() => {
    const options: SearchableOption[] = courses.map((course) => ({ value: course.id, label: course.name, description: course.code }));
    if (selectedClass?.course && !options.some((item) => item.value === selectedClass.course_id)) {
      options.unshift({ value: selectedClass.course_id, label: selectedClass.course.name, description: selectedClass.course.code });
    }
    return options;
  }, [courses, selectedClass]);
  const teacherOptions = useMemo<SearchableOption[]>(() => teachers.map((teacher) => ({ value: teacher.id, label: teacher.user.full_name, description: teacher.user.email })), [teachers]);
  const roomOptions = useMemo<SearchableOption[]>(() => rooms.map((room) => ({ value: room.id, label: room.name, description: room.location })), [rooms]);

  const handleSave = async () => {
    try {
      await updateClass(classId, {
        teacher_id: form.teacherId,
        room_id: form.roomId,
        name: form.name.trim(),
        code: form.code.trim() || null,
        class_type: form.classType,
        max_students: form.maxStudents,
        start_date: form.startDate || null,
        status: form.status,
      });
      toast.success("Cập nhật lớp học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật lớp học thất bại");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClass(classId);
      toast.success("Xóa lớp học thành công");
      navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa lớp học thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Cập nhật lớp học" description={selectedClass?.course?.name ?? "Cập nhật thông tin lớp học"} />
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
        <Button variant="destructive" onClick={() => void handleDelete()}>Xóa</Button>
        <Button onClick={() => void handleSave()}>Lưu cập nhật</Button>
      </div>
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <ClassFormFields value={form} courseOptions={courseOptions} teacherOptions={teacherOptions} roomOptions={roomOptions} disableCourse onChange={setForm} />
      </div>
      <div className="mt-6 space-y-4">
        <div className="inline-flex rounded-2xl border border-gray-100 bg-white p-1">
          <button type="button" onClick={() => setActiveTab("sessions")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "sessions" ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-gray-50"}`}>Lịch học</button>
          <button type="button" onClick={() => setActiveTab("students")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "students" ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-gray-50"}`}>Học viên</button>
        </div>
        {selectedClass && activeTab === "sessions" && <ClassSessionsTab classItem={selectedClass} />}
        {activeTab === "students" && <ClassStudentsTab classId={classId} />}
      </div>
    </section>
  );
}
