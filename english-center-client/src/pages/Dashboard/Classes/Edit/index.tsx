import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ClassFormFields, type ClassFormState } from "@/components/Dashboard/Classes/ClassFormFields";
import { ClassSessionsTab } from "@/components/Dashboard/Classes/ClassSessionsTab";
import { type SelectOption } from "@/components/Comon/Select";
import { ClassStudentsTab } from "@/components/Dashboard/Classes/ClassStudentsTab";
import { DashboardConfirmDeleteDialog, DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  startDate: null,
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
  const [deleteOpen, setDeleteOpen] = useState(false);

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
        startDate: item.start_date ? new Date(item.start_date) : null,
        status: item.status,
      });
    }).catch(() => toast.error("Không thể tải lớp học"));
    return () => clearSelectedClass();
  }, [classId, getClass, clearSelectedClass]);

  const courseOptions = useMemo<SelectOption[]>(() => {
    const options: SelectOption[] = courses.map((course) => ({ key: course.id, value: course.name }));
    if (selectedClass?.course && !options.some((item) => item.value === selectedClass.course_id)) {
      options.unshift({ key: selectedClass.course_id, value: selectedClass.course.name });
    }
    return options;
  }, [courses, selectedClass]);
  const teacherOptions = useMemo<SelectOption[]>(() => teachers.map((teacher) => ({ key: teacher.id, value: teacher.user.full_name })), [teachers]);
  const roomOptions = useMemo<SelectOption[]>(() => rooms.map((room) => ({ key: room.id, value: room.name })), [rooms]);

  const handleSave = async () => {
    try {
      await updateClass(classId, {
        teacher_id: form.teacherId,
        room_id: form.roomId,
        name: form.name.trim(),
        code: form.code.trim() || null,
        class_type: form.classType,
        max_students: form.maxStudents,
        start_date: form.startDate ? form.startDate.toISOString().slice(0, 10) : null,
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
      <DashboardListPageHeader
        title="Cập nhật lớp học"
        description={selectedClass?.course?.name ?? "Cập nhật thông tin lớp học"}
        actions={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Xóa</Button>
            <Button onClick={() => void handleSave()}>Lưu cập nhật</Button>
          </div>
        )}
      />
      <div className="space-y-6">
        <SectionCard title="Thông tin lớp học">
          <ClassFormFields value={form} courseOptions={courseOptions} teacherOptions={teacherOptions} roomOptions={roomOptions} hideCourse onChange={setForm} />
        </SectionCard>

        <SectionCard title="Nội dung liên quan">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sessions" | "students")}>
            <TabsList className="mb-4">
              <TabsTrigger value="sessions">Lịch học</TabsTrigger>
              <TabsTrigger value="students">Học viên</TabsTrigger>
            </TabsList>
            <TabsContent value="sessions" className="mt-0">
              {selectedClass && <ClassSessionsTab classItem={selectedClass} />}
            </TabsContent>
            <TabsContent value="students" className="mt-0">
              <ClassStudentsTab classId={classId} />
            </TabsContent>
          </Tabs>
        </SectionCard>
      </div>

      <DashboardConfirmDeleteDialog
        open={deleteOpen}
        title="Xóa lớp học"
        description="Bạn có chắc chắn muốn xóa lớp học này không?"
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </section>
  );
}
