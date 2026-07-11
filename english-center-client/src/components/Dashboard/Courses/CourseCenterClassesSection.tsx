import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import TableList, { type TableListColumn } from "@/components/Comon/TableList";
import { DashboardConfirmDeleteDialog } from "@/components/Dashboard/Comon";
import { CourseClassSchedulesSection } from "@/components/Dashboard/Courses/CourseClassSchedulesSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassFormFields, type ClassFormState } from "@/components/Dashboard/Classes/ClassFormFields";
import { type MutilSelectOption } from "@/components/Comon/MutilSelect";
import type { ClassCreateRequest, ClassItem, ClassUpdateRequest } from "@/services/classes/classes.type";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { generateCode } from "@/shared/helpers/code-format";
import type { SelectValue } from "@/components/ui/select";

const emptyClassForm: ClassFormState = {
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

const classStatusLabel = (status: string) =>
  ({ planned: "Dự kiến", ongoing: "Đang học", completed: "Hoàn thành", cancelled: "Đã hủy", archived: "Lưu trữ" }[status] ?? status);

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa có ngày");

type CourseCenterClassesSectionProps = {
  courseId: string;
  courseName?: string;
  classes: ClassItem[];
  onCreateClass: (payload: ClassCreateRequest) => Promise<void>;
  onUpdateClass: (classId: string, payload: ClassUpdateRequest) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
};

export const CourseCenterClassesSection = ({
  courseId,
  courseName,
  classes,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
}: CourseCenterClassesSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [form, setForm] = useState<ClassFormState>(emptyClassForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { teachers, listTeachers } = useTeachersStore();
  const { rooms, listRooms } = useRoomsStore();

  useEffect(() => {
    void listTeachers({ page: 1, page_size: 100 }).catch(() => toast.error("Không thể tải danh sách giáo viên"));
    void listRooms({ page: 1, page_size: 100, status: "active" }).catch(() => toast.error("Không thể tải danh sách phòng học"));
  }, [listTeachers, listRooms]);

  const teacherOptions = useMemo<MutilSelectOption[]>(
    () => teachers.map((teacher) => ({ value: teacher.id, key: teacher.user.full_name, description: teacher.user.email })),
    [teachers],
  );
  const roomOptions = useMemo<MutilSelectOption[]>(
    () => rooms.map((room) => ({ value: room.id, key: room.name, description: room.location })),
    [rooms],
  );
  const selectedClass = useMemo(() => classes.find((item) => item.id === selectedClassId) ?? null, [classes, selectedClassId]);

  const openCreate = () => {
    setDialogMode("create");
    setSelectedClassId(null);
    setForm(emptyClassForm);
    setDialogOpen(true);
  };

  const openEdit = (item: ClassItem) => {
    setDialogMode("edit");
    setSelectedClassId(item.id);
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
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSaving(false);
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }

    setSaving(true);
    try {
      const payload: ClassCreateRequest = {
        course_id: courseId,
        teacher_id: form.teacherId,
        room_id: form.roomId,
        name: form.name.trim(),
        code: form.code.trim() || generateCode(form.name),
        class_type: form.classType,
        max_students: Number(form.maxStudents || 1),
        start_date:  new Date(form.startDate),
        status: form.status,
      };

      if (dialogMode === "edit" && selectedClass) {
        await onUpdateClass(selectedClass.id, payload);
        toast.success("Cập nhật lớp học thành công");
      } else {
        await onCreateClass(payload);
        toast.success("Thêm lớp học thành công");
      }
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu lớp học thất bại");
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await onDeleteClass(deletingId);
      toast.success("Xóa lớp thành công");
      setDeletingId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa lớp thất bại");
    }
  };

  const columns = useMemo<TableListColumn<ClassItem>[]>(
    () => [
      {
        key: "name",
        header: "Lớp",
        className: "px-4 py-3",
        render: (item) => (
          <div>
            <p className="font-medium text-ink">{item.name}</p>
            <p className="text-xs text-caption">{item.code || "Chưa có mã"}</p>
          </div>
        ),
      },
      {
        key: "class_type",
        header: "Hình thức",
        className: "px-4 py-3",
        render: (item) => item.class_type,
      },
      {
        key: "students",
        header: "Sĩ số",
        className: "px-4 py-3",
        render: (item) => `${item.current_students_count}/${item.max_students}`,
      },
      {
        key: "start_date",
        header: "Ngày khai giảng",
        className: "px-4 py-3",
        render: (item) => formatDate(item.start_date),
      },
      {
        key: "status",
        header: "Trạng thái",
        className: "px-4 py-3",
        render: (item) => <Badge className="bg-blue-50 text-blue-700">{classStatusLabel(item.status)}</Badge>,
      },
      {
        key: "actions",
        header: "Thao tác",
        headerClassName: "text-right",
        className: "px-4 py-3 text-right",
        render: (item) => (
          <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
            <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)}>
              <Pencil className="h-4 w-4" />
              Sửa
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => setDeletingId(item.id)}>
              <Trash2 className="h-4 w-4" />
              Xóa
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quản lý lớp học đi kèm</h3>
          <p className="mt-1 text-sm text-gray-500">Xem nhanh, chỉnh sửa và mở lịch học trong tuần ngay trong dialog.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-50 text-blue-700">{classes.length} lớp</Badge>
          <Button type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm lớp
          </Button>
        </div>
      </div>

      <TableList
        columns={columns}
        data={classes}
        getRowId={(row) => row.id}
        emptyText="Chưa có lớp nào cho khóa center này."
        onRowClick={openEdit}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="min-w-7xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Thêm lớp học" : "Chỉnh sửa lớp học"}</DialogTitle>
            <DialogDescription>{courseName ? `Khóa học: ${courseName}` : "Thông tin lớp học và lịch học trong tuần."}</DialogDescription>
          </DialogHeader>

          <div className="h-[70vh] overflow-y-scroll">
            <ClassFormFields
              value={form}
              courseOptions={[{ key: courseId, value: courseName || "Khóa học" }]}
              teacherOptions={teacherOptions}
              roomOptions={roomOptions}
              hideCourse
              hideCode
              onChange={setForm}
            />

            {dialogMode === "edit" && selectedClass ? (
              <CourseClassSchedulesSection classes={classes} selectedClassId={selectedClass.id} hideClassSelect />
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                Lưu lớp học trước, rồi mở lại để chỉnh lịch học trong tuần.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Đóng
            </Button>
            <Button type="button" onClick={() => void submit()} disabled={saving}>
              {dialogMode === "edit" ? "Lưu thay đổi" : "Thêm lớp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardConfirmDeleteDialog
        open={Boolean(deletingId)}
        title="Xóa lớp học"
        description="Bạn có chắc chắn muốn xóa lớp học này không?"
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
