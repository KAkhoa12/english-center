import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import AssignmentQuestionsDialog from "@/components/AssignmentQuestionsDialog";
import {
  DashboardListPageHeader,
  SectionCard,
} from "@/components/Dashboard/Comon";
import {
  sessionModeOptions,
  sessionStatusOptions,
} from "@/components/Dashboard/Classes/classOptions";
import {
  SearchableSelect,
  type SearchableOption,
} from "@/components/Dashboard/Classes/SearchableSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import type { Assignment } from "@/services/assignments/assignments.type";
import { useAssignmentTypesStore } from "@/services/assignmentTypes/assignmentTypes.store";
import { useAttendanceStore } from "@/services/attendance/attendance.store";
import type { AttendanceItem } from "@/services/attendance/attendance.type";
import { useClassSessionMediaStore } from "@/services/classSessionMedia/classSessionMedia.store";
import { useClassSessionsStore } from "@/services/classSessions/classSessions.store";
import type { UpdateClassSessionRequest } from "@/services/classSessions/classSessions.type";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import { useTeachersStore } from "@/services/teachers/teachers.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const tabs = [
  { value: "info", label: "Thông tin" },
  { value: "attendance", label: "Điểm danh" },
  { value: "materials", label: "Tài liệu tham khảo" },
  { value: "assignments", label: "Bài tập" },
] as const;

const attendanceStatusOptions = [
  { value: "not_marked", label: "Chưa điểm danh" },
  { value: "present", label: "Có mặt" },
  { value: "absent", label: "Vắng" },
  { value: "late", label: "Đi muộn" },
  { value: "excused", label: "Có phép" },
];

const formatTime = (value?: string | null) => value?.slice(0, 5) || "--:--";

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
      {label}
    </p>
    <div className="mt-1 text-sm font-semibold text-gray-900">
      {value || "-"}
    </div>
  </div>
);

type InfoFormState = {
  title: string;
  teacherId: string | null;
  lessonId: string | null;
  roomId: string | null;
  sessionDate: string;
  overrideStartTime: string;
  overrideEndTime: string;
  mode: string;
  meetingUrl: string;
  status: string;
  description: string;
  note: string;
};

export default function DashboardSessionDetailPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["value"]>("info");
  const { selectedSession, getSession, updateSession, clearSelectedSession } =
    useClassSessionsStore();
  const { attendance, getSessionAttendance, updateAttendance, markAttendance } =
    useAttendanceStore();
  const { mediaBySessionId, listMedia, uploadMedia, deleteMedia } =
    useClassSessionMediaStore();
  const {
    assignments,
    availableAssignments,
    listClassAssignments,
    listAvailableAssignments,
    createSessionAssignment,
    createSessionAssignmentFromTemplate,
  } = useAssignmentsStore();
  const { teachers, listTeachers } = useTeachersStore();
  const { rooms, listRooms } = useRoomsStore();
  const { assignmentTypes, listAssignmentTypes } = useAssignmentTypesStore();
  const [infoForm, setInfoForm] = useState<InfoFormState | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [templateAssignmentId, setTemplateAssignmentId] = useState<
    string | null
  >(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTypeId, setNewTypeId] = useState("");
  const [questionAssignment, setQuestionAssignment] = useState<Assignment | null>(null);
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const sessionMedia = useMemo(
    () => mediaBySessionId[sessionId] ?? [],
    [mediaBySessionId, sessionId],
  );
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
  const lessonOptions: SearchableOption[] = [];
  const templateAssignmentOptions = useMemo<SearchableOption[]>(
    () =>
      availableAssignments.map((assignment) => ({
        value: assignment.id,
        label: assignment.title,
        description: assignment.assignment_type?.name ?? assignment.status,
      })),
    [availableAssignments],
  );

  useEffect(() => {
    if (!sessionId) return;
    void getSession(sessionId).catch((error) =>
      toast.error(
        error instanceof Error ? error.message : "Không thể tải buổi học",
      ),
    );
    return () => clearSelectedSession();
  }, [clearSelectedSession, getSession, sessionId]);

  useEffect(() => {
    if (!selectedSession) return;
    setInfoForm({
      title: selectedSession.title,
      teacherId: selectedSession.teacher_id,
      lessonId: selectedSession.lesson_id,
      roomId: selectedSession.room_id,
      sessionDate: selectedSession.session_date,
      overrideStartTime: selectedSession.override_start_time?.slice(0, 5) ?? "",
      overrideEndTime: selectedSession.override_end_time?.slice(0, 5) ?? "",
      mode: selectedSession.mode,
      meetingUrl: selectedSession.meeting_url ?? "",
      status: selectedSession.status,
      description: selectedSession.description ?? "",
      note: selectedSession.note ?? "",
    });
  }, [selectedSession]);

  useEffect(() => {
    if (activeTab !== "info") return;
    void listTeachers({ page: 1, page_size: 100 }).catch(() =>
      toast.error("Không thể tải giáo viên"),
    );
    void listRooms({ page: 1, page_size: 100, status: "active" }).catch(() =>
      toast.error("Không thể tải phòng học"),
    );
  }, [activeTab, listRooms, listTeachers]);

  useEffect(() => {
    if (activeTab !== "info" || !selectedSession?.course?.id) return;
  }, [activeTab, selectedSession?.course?.id]);

  useEffect(() => {
    if (!sessionId || activeTab !== "attendance") return;
    void getSessionAttendance(sessionId, { page: 1, page_size: 100 }).catch(
      (error) =>
        toast.error(
          error instanceof Error ? error.message : "Không thể tải điểm danh",
        ),
    );
  }, [activeTab, getSessionAttendance, sessionId]);

  useEffect(() => {
    if (!sessionId || activeTab !== "materials") return;
    void listMedia(sessionId).catch((error) =>
      toast.error(
        error instanceof Error ? error.message : "Không thể tải tài liệu",
      ),
    );
  }, [activeTab, listMedia, sessionId]);

  useEffect(() => {
    if (!selectedSession?.class_id || activeTab !== "assignments") return;
    void listClassAssignments(selectedSession.class_id, {
      page: 1,
      page_size: 100,
      session_id: selectedSession.id,
    }).catch((error) =>
      toast.error(
        error instanceof Error ? error.message : "Không thể tải bài tập",
      ),
    );
  }, [activeTab, listClassAssignments, selectedSession]);

  useEffect(() => {
    if (activeTab !== "assignments") return;
    void listAvailableAssignments({ page: 1, page_size: 100 }).catch((error) =>
      toast.error(
        error instanceof Error ? error.message : "Không thể tải bài tập có sẵn",
      ),
    );
    void listAssignmentTypes({ page: 1, page_size: 100, status: "active" }).catch(() => {});
  }, [activeTab, listAvailableAssignments, listAssignmentTypes]);

  const refreshAttendance = () => {
    if (!sessionId) return Promise.resolve([]);
    return getSessionAttendance(sessionId, { page: 1, page_size: 100 });
  };

  const handleAttendanceStatus = async (
    item: AttendanceItem,
    status: string,
  ) => {
    if (!sessionId || status === item.status) return;
    try {
      if (item.id) {
        await updateAttendance(item.id, { status });
      } else {
        await markAttendance(sessionId, [
          { student_id: item.student_id, status },
        ]);
      }
      await refreshAttendance();
      toast.success("Đã cập nhật điểm danh");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Cập nhật điểm danh thất bại",
      );
    }
  };

  const updateInfoForm = (patch: Partial<InfoFormState>) => {
    setInfoForm((current) => (current ? { ...current, ...patch } : current));
  };

  const handleSaveInfo = async () => {
    if (!infoForm || !sessionId || !selectedSession) return;
    const payload: UpdateClassSessionRequest = {
      title: infoForm.title.trim(),
      teacher_id: infoForm.teacherId,
      lesson_id: infoForm.lessonId,
      room_id: infoForm.mode === "offline" ? infoForm.roomId : null,
      session_date: infoForm.sessionDate,
      class_schedule_id: selectedSession.class_schedule_id,
      override_start_time: infoForm.overrideStartTime || null,
      override_end_time: infoForm.overrideEndTime || null,
      mode: infoForm.mode,
      meeting_url:
        infoForm.mode === "online" ? infoForm.meetingUrl.trim() || null : null,
      status: infoForm.status,
      description: infoForm.description.trim() || null,
      note: infoForm.note.trim() || null,
    };
    try {
      await updateSession(sessionId, payload);
      toast.success("Đã cập nhật thông tin buổi học");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Cập nhật buổi học thất bại",
      );
    }
  };

  const handleUploadMaterial = async () => {
    if (!sessionId || !uploadFile) {
      toast.error("Vui lòng chọn file tài liệu");
      return;
    }
    try {
      await uploadMedia(sessionId, {
        file: uploadFile,
        title: uploadTitle.trim() || uploadFile.name,
        description: uploadDescription.trim() || null,
      });
      setUploadFile(null);
      setUploadTitle("");
      setUploadDescription("");
      toast.success("Đã tải tài liệu tham khảo");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Tải tài liệu thất bại",
      );
    }
  };

  const handleDeleteMaterial = async (mediaId: string) => {
    try {
      await deleteMedia(sessionId, mediaId);
      toast.success("Đã xóa tài liệu");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Xóa tài liệu thất bại",
      );
    }
  };

  const handleCreateAssignment = async () => {
    if (!sessionId || !newTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài tập");
      return;
    }
    if (!newTypeId) {
      toast.error("Vui lòng chọn loại bài tập");
      return;
    }
    try {
      await createSessionAssignment(sessionId, { title: newTitle.trim(), assignment_type_id: newTypeId });
      setNewTitle("");
      setNewTypeId("");
      if (selectedSession?.class_id) {
        await listClassAssignments(selectedSession.class_id, {
          page: 1,
          page_size: 100,
          session_id: selectedSession.id,
        });
      }
      toast.success("Đã tạo bài tập");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tạo bài tập thất bại");
    }
  };

  const handleCreateAssignmentFromTemplate = async () => {
    if (!sessionId || !templateAssignmentId) {
      toast.error("Vui lòng chọn bài tập có sẵn");
      return;
    }
    try {
      await createSessionAssignmentFromTemplate(
        sessionId,
        templateAssignmentId,
        {},
      );
      setTemplateAssignmentId(null);
      if (selectedSession?.class_id) {
        await listClassAssignments(selectedSession.class_id, {
          page: 1,
          page_size: 100,
          session_id: selectedSession.id,
        });
      }
      toast.success("Đã tạo bài tập từ mẫu");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Tạo bài tập từ mẫu thất bại",
      );
    }
  };

  if (!selectedSession) {
    return (
      <section>
        <DashboardListPageHeader
          title="Chi tiết buổi học"
          description="Đang tải dữ liệu buổi học"
        />
        <SectionCard title="Buổi học">
          <p className="text-sm text-gray-500">Đang tải...</p>
        </SectionCard>
      </section>
    );
  }

  return (
    <section>
      <DashboardListPageHeader
        title={selectedSession.title}
        description={`${selectedSession.class?.name ?? "Lớp học"} · ${selectedSession.session_date} · ${formatTime(selectedSession.start_time)} - ${formatTime(selectedSession.end_time)}`}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_SESSIONS)}
          >
            Quay lại
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.value
                ? "bg-brand-500 text-white shadow-sm"
                : "border border-gray-100 bg-white text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" ? (
        <SectionCard title="Thông tin buổi học">
          {infoForm ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Lớp học" value={selectedSession.class?.name} />
                <InfoRow
                  label="Khóa học"
                  value={selectedSession.course?.name}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Tên buổi học
                  <Input
                    value={infoForm.title}
                    onChange={(event) =>
                      updateInfoForm({ title: event.target.value })
                    }
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Giáo viên
                  <SearchableSelect
                    value={infoForm.teacherId}
                    options={teacherOptions}
                    placeholder="Chọn giáo viên"
                    onChange={(teacherId) => updateInfoForm({ teacherId })}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Bài học
                  <SearchableSelect
                    value={infoForm.lessonId}
                    options={lessonOptions}
                    placeholder="Chọn bài học"
                    onChange={(lessonId) => updateInfoForm({ lessonId })}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Hình thức
                  <Select
                    value={infoForm.mode}
                    onValueChange={(mode) => updateInfoForm({ mode })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionModeOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                {infoForm.mode === "offline" ? (
                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    Phòng học
                    <SearchableSelect
                      value={infoForm.roomId}
                      options={roomOptions}
                      placeholder="Chọn phòng học"
                      onChange={(roomId) => updateInfoForm({ roomId })}
                    />
                  </label>
                ) : (
                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    Link học online
                    <Input
                      value={infoForm.meetingUrl}
                      onChange={(event) =>
                        updateInfoForm({ meetingUrl: event.target.value })
                      }
                      placeholder="Có thể để trống"
                    />
                  </label>
                )}
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Ngày học
                  {/*<DashboardDateInput
                    value={infoForm.sessionDate}
                    onChange={(sessionDate) => updateInfoForm({ sessionDate })}
                  />*/}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    Override bắt đầu
                    <Input
                      type="time"
                      value={infoForm.overrideStartTime}
                      onChange={(event) =>
                        updateInfoForm({
                          overrideStartTime: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    Override kết thúc
                    <Input
                      type="time"
                      value={infoForm.overrideEndTime}
                      onChange={(event) =>
                        updateInfoForm({ overrideEndTime: event.target.value })
                      }
                    />
                  </label>
                </div>
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Trạng thái
                  <Select
                    value={infoForm.status}
                    onValueChange={(status) => updateInfoForm({ status })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionStatusOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
                  Mô tả
                  <Textarea
                    value={infoForm.description}
                    onChange={(event) =>
                      updateInfoForm({ description: event.target.value })
                    }
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
                  Ghi chú
                  <Textarea
                    value={infoForm.note}
                    onChange={(event) =>
                      updateInfoForm({ note: event.target.value })
                    }
                  />
                </label>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={() => void handleSaveInfo()}>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {activeTab === "attendance" ? (
        <SectionCard title="Điểm danh học viên">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-gray-500"
                    >
                      Chưa có học viên để điểm danh
                    </TableCell>
                  </TableRow>
                ) : (
                  attendance.map((item) => (
                    <TableRow key={`${item.student_id}-${item.id ?? "empty"}`}>
                      <TableCell className="font-semibold text-gray-900">
                        {item.student.full_name}
                      </TableCell>
                      <TableCell>{item.student.email}</TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(status) =>
                            void handleAttendanceStatus(item, status)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {attendanceStatusOptions.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatTime(item.check_in_time)}</TableCell>
                      <TableCell>{item.note ?? "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "materials" ? (
        <SectionCard title="Tài liệu tham khảo">
          <div className="mb-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                File tài liệu
                <Input
                  type="file"
                  onChange={(event) =>
                    setUploadFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Tiêu đề
                <Input
                  value={uploadTitle}
                  onChange={(event) => setUploadTitle(event.target.value)}
                  placeholder={uploadFile?.name ?? "Tên tài liệu"}
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
                Mô tả
                <Textarea
                  value={uploadDescription}
                  onChange={(event) => setUploadDescription(event.target.value)}
                />
              </label>
            </div>
            <div className="mt-3 flex justify-end">
              <Button type="button" onClick={() => void handleUploadMaterial()}>
                Upload tài liệu
              </Button>
            </div>
          </div>
          {sessionMedia.length === 0 ? (
            <p className="text-sm text-gray-500">
              Chưa có tài liệu tham khảo cho buổi học này.
            </p>
          ) : (
            <div className="grid gap-3">
              {sessionMedia.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.title ||
                          item.media?.original_filename ||
                          "Tài liệu buổi học"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.description || "Không có mô tả"}
                      </p>
                    </div>
                    {item.media?.url ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          window.open(item.media?.url ?? "", "_blank")
                        }
                      >
                        Mở tài liệu
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => void handleDeleteMaterial(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}

      {activeTab === "assignments" ? (
        <SectionCard title="Bài tập của buổi học">
          <div className="mb-5 space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-800">Tạo bài tập mới</p>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Tiêu đề bài tập" />
                <Select value={newTypeId} onValueChange={setNewTypeId}>
                  <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                  <SelectContent>
                    {assignmentTypes.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={() => void handleCreateAssignment()}>Tạo</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <SearchableSelect
                value={templateAssignmentId}
                options={templateAssignmentOptions}
                placeholder="Chọn bài tập có sẵn để tạo cho buổi học"
                searchPlaceholder="Tìm bài tập có sẵn..."
                onChange={setTemplateAssignmentId}
              />
              <Button
                type="button"
                onClick={() => void handleCreateAssignmentFromTemplate()}
              >
                Tạo từ mẫu
              </Button>
            </div>
          </div>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">
              Chưa có bài tập nào gắn với buổi học này.
            </p>
          ) : (
            <div className="grid gap-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {assignment.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {assignment.description ||
                          assignment.instruction ||
                          "Không có mô tả"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="border-brand-100 bg-brand-50 text-brand-700"
                    >
                      {assignment.status}
                    </Badge>
                    <Button type="button" variant="outline" size="sm" onClick={() => { setQuestionAssignment(assignment as unknown as Assignment); setQuestionsOpen(true); }}>Câu hỏi</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_ASSIGNMENTS_GRADING.replace(":assignmentId", assignment.id))}>Trả lời</Button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-500 md:grid-cols-3">
                    <span>Loại: {assignment.assignment_type?.name ?? "-"}</span>
                    <span>Điểm tối đa: {assignment.max_score}</span>
                    <span>
                      Hạn nộp:{" "}
                      {assignment.due_at
                        ? new Date(assignment.due_at).toLocaleString("vi-VN")
                        : "Không giới hạn"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </SectionCard>
      ) : null}

      <AssignmentQuestionsDialog assignment={questionAssignment} open={questionsOpen} onOpenChange={setQuestionsOpen} />
    </section>
  );
}
