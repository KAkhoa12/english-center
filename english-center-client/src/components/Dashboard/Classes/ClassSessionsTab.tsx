import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import type {
  BulkCreateClassSessionsRequest,
  ClassSession,
  CreateClassSessionRequest,
  UpdateClassSessionRequest,
} from "@/services/classSessions/classSessions.type";
import type { ClassItem } from "@/services/classes/classes.type";
import { useLessonsStore } from "@/services/lessons/lessons.store";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import type { SearchableOption } from "./SearchableSelect";
import { ClassSessionAutoCreateDialog } from "./ClassSessionAutoCreateDialog";
import { ClassSessionDialog } from "./ClassSessionDialog";
import { ClassSessionsTable } from "./ClassSessionsTable";
import { sessionModeOptions, sessionStatusOptions } from "./classOptions";

type ClassSessionsTabProps = {
  classItem: ClassItem;
};

export function ClassSessionsTab({ classItem }: ClassSessionsTabProps) {
  const {
    sessions,
    pagination,
    isLoading,
    listAllSessions,
    createSession,
    createSessionsBulk,
    updateSession,
    deleteSession,
  } = useClassSessionsStore();
  const { teachers, listTeachers } = useTeachersStore();
  const { rooms, listRooms } = useRoomsStore();
  const { lessons, listLessons } = useLessonsStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [mode, setMode] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClassSession | null>(null);
  const [deleting, setDeleting] = useState<ClassSession | null>(null);

  useEffect(() => {
    void listTeachers({ page: 1, page_size: 100 }).catch(() =>
      toast.error("Không thể tải giáo viên"),
    );
    void listRooms({ page: 1, page_size: 100, status: "active" }).catch(() =>
      toast.error("Không thể tải phòng học"),
    );
  }, [listTeachers, listRooms]);

  useEffect(() => {
    if (!classItem.course_id) return;
    void listLessons(classItem.course_id, {
      page: 1,
      page_size: 100,
      status: "active",
    }).catch(() => toast.error("Không thể tải bài học"));
  }, [classItem.course_id, listLessons]);

  useEffect(() => {
    void listAllSessions({
      page,
      page_size: pageSize,
      class_id: classItem.id,
      status: status === "all" ? undefined : status,
      mode: mode === "all" ? undefined : mode,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }).catch((error) =>
      toast.error(
        error instanceof Error ? error.message : "Không thể tải lịch học",
      ),
    );
  }, [
    classItem.id,
    listAllSessions,
    page,
    pageSize,
    status,
    mode,
    fromDate,
    toDate,
  ]);

  const teacherOptions = useMemo<SearchableOption[]>(
    () =>
      teachers.map((teacher) => ({
        value: teacher.id,
        label: teacher.user.full_name,
        description: teacher.user.email,
      })),
    [teachers],
  );
  const roomOptions = useMemo<SearchableOption[]>(
    () =>
      rooms.map((room) => ({
        value: room.id,
        label: room.name,
        description: room.location,
      })),
    [rooms],
  );
  const lessonOptions = useMemo<SearchableOption[]>(
    () =>
      lessons.map((lesson) => ({
        value: lesson.id,
        label: lesson.title,
        description: lesson.module?.title,
      })),
    [lessons],
  );

  const refresh = () =>
    listAllSessions({
      page,
      page_size: pageSize,
      class_id: classItem.id,
      status: status === "all" ? undefined : status,
      mode: mode === "all" ? undefined : mode,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    });

  const handleSubmit = async (
    data: CreateClassSessionRequest | UpdateClassSessionRequest,
  ) => {
    try {
      if (editing) {
        await updateSession(editing.id, data as UpdateClassSessionRequest);
        toast.success("Cập nhật lịch học thành công");
      } else {
        await createSession(classItem.id, data as CreateClassSessionRequest);
        toast.success("Thêm lịch học thành công");
      }
      setDialogOpen(false);
      setEditing(null);
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lưu lịch học thất bại",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteSession(deleting.id);
      toast.success("Xóa lịch học thành công");
      setDeleting(null);
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Xóa lịch học thất bại",
      );
    }
  };

  const handleCreateBulk = async (data: BulkCreateClassSessionsRequest) => {
    if (!data.class_schedule_ids.length) {
      toast.error("Vui lòng chọn ít nhất một lịch học trong tuần");
      return;
    }
    try {
      const created = await createSessionsBulk(classItem.id, data);
      toast.success(`Đã tạo ${created.length} buổi học`);
      setAutoDialogOpen(false);
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Tạo lịch học tự động thất bại",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {sessionStatusOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={mode}
          onValueChange={(value) => {
            setMode(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hình thức</SelectItem>
            {sessionModeOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/*<DashboardDateInput
          value={fromDate}
          onChange={(value) => {
            setFromDate(value);
            setPage(1);
          }}
          className="w-40"
        />*/}
        {/*<DashboardDateInput
          value={toDate}
          onChange={(value) => {
            setToDate(value);
            setPage(1);
          }}
          className="w-40"
        />*/}
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Thêm lịch học mới
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setAutoDialogOpen(true)}
        >
          Tạo tự động
        </Button>
      </div>
      <ClassSessionsTable
        data={sessions}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onEdit={(item) => {
          setEditing(item);
          setDialogOpen(true);
        }}
        onDelete={setDeleting}
      />
      <ClassSessionDialog
        open={dialogOpen}
        session={editing}
        schedules={classItem.schedules ?? []}
        teacherOptions={teacherOptions}
        lessonOptions={lessonOptions}
        roomOptions={roomOptions}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
      <ClassSessionAutoCreateDialog
        open={autoDialogOpen}
        classItem={classItem}
        teacherOptions={teacherOptions}
        lessonOptions={lessonOptions}
        roomOptions={roomOptions}
        onOpenChange={setAutoDialogOpen}
        onSubmit={handleCreateBulk}
      />
      <DashboardConfirmDeleteDialog
        open={Boolean(deleting)}
        title="Xóa lịch học"
        description={`Bạn có chắc chắn muốn xóa lịch ${deleting?.title ?? "này"}?`}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
