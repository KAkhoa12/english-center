import { ChevronDown, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EditorJsField } from "@/components/Dashboard/Courses/EditorJsField";
import { useAssignmentQuestionOptionsStore } from "@/services/assignmentQuestionOptions/assignmentQuestionOptions.store";
import type { AssignmentQuestionOption } from "@/services/assignmentQuestionOptions/assignmentQuestionOptions.type";
import { useAssignmentQuestionsStore } from "@/services/assignmentQuestions/assignmentQuestions.store";
import type { AssignmentQuestion } from "@/services/assignmentQuestions/assignmentQuestions.type";
import { useAssignmentTypesStore } from "@/services/assignmentTypes/assignmentTypes.store";
import { useAssignmentsStore } from "@/services/assignments/assignments.store";
import type { Assignment, AssignmentCreateRequest } from "@/services/assignments/assignments.type";
import type { EditorJsDocument } from "@/shared/types/editorjs";
import { normalizeEditorJsDocument } from "@/shared/helpers/editorjs";

type CourseTemplateModulesSectionProps = {
  courseId: string;
};

type MediaLike = {
  url?: string | null;
  content_type?: string | null;
  original_filename?: string | null;
} | null;

type LessonFormState = {
  module_id: string;
  title: string;
  description: string;
  content: EditorJsDocument | null;
  estimated_duration_minutes: string;
  order_index: string;
  status: string;
};

const moduleStatuses = [
  { value: "active", label: "Đang mở" },
  { value: "inactive", label: "Tạm ẩn" },
];

const lessonStatuses = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];

const assignmentStatuses = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "closed", label: "Đã đóng" },
  { value: "archived", label: "Lưu trữ" },
];

const questionTypes = [
  { value: "single_choice", label: "Một đáp án" },
  { value: "multiple_choice", label: "Nhiều đáp án" },
  { value: "text_answer", label: "Tự luận" },
  { value: "file_upload", label: "Nộp file" },
];

const isChoiceQuestion = (type: string) => type === "single_choice" || type === "multiple_choice";

const MediaPreview = ({ media }: { media: MediaLike }) => {
  if (!media?.url) {
    return (
      <div className="flex h-20 w-28 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400">
        Chưa có media
      </div>
    );
  }

  if (media.content_type?.startsWith("video/")) {
    return <video src={media.url} className="h-20 w-28 rounded-xl bg-gray-100 object-cover" controls />;
  }

  return <img src={media.url} alt={media.original_filename || "Media"} className="h-20 w-28 rounded-xl object-cover" />;
};

const FieldLabel = ({ children }: { children: string }) => (
  <label className="text-sm font-medium text-gray-700">{children}</label>
);

const useLocalState = () => {
  const [modules, _setModules] = useState<any[]>([]);
  const listModules = async (..._args: any[]) => {};
  const createModule = async (_courseId: string, payload: any) => ({ ...payload, id: "new" });
  const updateModule = async (_id: string, payload: any) => payload;
  const uploadModuleMedia = async (..._args: any[]) => {};
  const deleteModule = async (..._args: any[]) => {};

  const [lessons, _setLessons] = useState<any[]>([]);
  const listLessons = async (..._args: any[]) => {};
  const createLesson = async (_courseId: string, payload: any) => ({ ...payload, id: "new" });
  const updateLesson = async (_id: string, payload: any) => payload;
  const uploadLessonThumbnail = async (..._args: any[]) => ({ id: "" });
  const deleteLesson = async (..._args: any[]) => {};

  return { modules, listModules, createModule, updateModule, uploadModuleMedia, deleteModule, lessons, listLessons, createLesson, updateLesson, uploadLessonThumbnail, deleteLesson };
};

export const CourseTemplateModulesSection = ({ courseId }: CourseTemplateModulesSectionProps) => {
  const { modules, listModules, createModule, updateModule, uploadModuleMedia, deleteModule, lessons, listLessons, createLesson, updateLesson, uploadLessonThumbnail, deleteLesson } = useLocalState();
  const { listAssignmentTypes } = useAssignmentTypesStore();

  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonPanelOpen, setLessonPanelOpen] = useState(false);
  const [lessonEditorKey, setLessonEditorKey] = useState(0);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [prefillModuleId, setPrefillModuleId] = useState<string>("");
  const [moduleFile, setModuleFile] = useState<File | null>(null);
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    order_index: "0",
    status: "active",
  });
  const [lessonForm, setLessonForm] = useState<LessonFormState>({
    module_id: "",
    title: "",
    description: "",
    content: null,
    estimated_duration_minutes: "",
    order_index: "0",
    status: "draft",
  });

  useEffect(() => {
    void listModules(courseId).catch(() => toast.error("Không thể tải module khóa học"));
    void listLessons(courseId, { page: 1, page_size: 200, sort_by: "order_index", sort_order: "asc" }).catch(() =>
      toast.error("Không thể tải bài học")
    );
    void listAssignmentTypes({ page: 1, page_size: 100, status: "active", sort_by: "name", sort_order: "asc" }).catch(() =>
      toast.error("Không thể tải loại bài tập")
    );
  }, [courseId, listAssignmentTypes, listLessons, listModules]);

  const lessonsByModule = useMemo(() => {
    return lessons.reduce<Record<string, any[]>>((acc, lesson) => {
      const key = lesson.module_id || "none";
      acc[key] = acc[key] || [];
      acc[key].push(lesson);
      return acc;
    }, {});
  }, [lessons]);

  const openCreateModule = () => {
    setEditingModule(null);
    setModuleFile(null);
    setModuleForm({ title: "", description: "", order_index: String(modules.length), status: "active" });
    setModuleDialogOpen(true);
  };

  const openEditModule = (module: any) => {
    setEditingModule(module);
    setModuleFile(null);
    setModuleForm({
      title: module.title,
      description: module.description || "",
      order_index: String(module.order_index),
      status: module.status || "active",
    });
    setModuleDialogOpen(true);
  };

  const openCreateLesson = (moduleId: string) => {
    setEditingLesson(null);
    setLessonFile(null);
    setPrefillModuleId(moduleId);
    setLessonEditorKey((value) => value + 1);
    setLessonForm({
      module_id: moduleId,
      title: "",
      description: "",
      content: null,
      estimated_duration_minutes: "",
      order_index: String(lessonsByModule[moduleId]?.length ?? 0),
      status: "draft",
    });
    setLessonPanelOpen(true);
  };

  const openEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setLessonFile(null);
    setPrefillModuleId(lesson.module_id || "");
    setLessonEditorKey((value) => value + 1);
    setLessonForm({
      module_id: lesson.module_id || "",
      title: lesson.title,
      description: lesson.description || "",
      content: normalizeEditorJsDocument(lesson.content),
      estimated_duration_minutes: lesson.estimated_duration_minutes ? String(lesson.estimated_duration_minutes) : "",
      order_index: String(lesson.order_index),
      status: lesson.status || "draft",
    });
    setLessonPanelOpen(true);
  };

  const refreshLessons = async () => {
    await listLessons(courseId, { page: 1, page_size: 200, sort_by: "order_index", sort_order: "asc" });
  };

  const handleSaveModule = async () => {
    if (!moduleForm.title.trim()) {
      toast.error("Vui lòng nhập tên module");
      return;
    }

    try {
      const payload = {
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim() || null,
        order_index: Number(moduleForm.order_index || 0),
        status: moduleForm.status,
      };
      const module = editingModule
        ? await updateModule(editingModule.id, payload)
        : await createModule(courseId, payload);

      if (moduleFile) {
        await uploadModuleMedia(module.id, moduleFile);
      }

      setModuleDialogOpen(false);
      toast.success(editingModule ? "Cập nhật module thành công" : "Thêm module thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu module thất bại");
    }
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.module_id || !lessonForm.title.trim()) {
      toast.error("Vui lòng chọn module và nhập tên bài học");
      return;
    }

    try {
      const payload = {
        module_id: lessonForm.module_id,
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim() || null,
        content: lessonForm.content,
        estimated_duration_minutes: lessonForm.estimated_duration_minutes
          ? Number(lessonForm.estimated_duration_minutes)
          : null,
        order_index: Number(lessonForm.order_index || 0),
        status: lessonForm.status,
      };
      let lesson = editingLesson
        ? await updateLesson(editingLesson.id, payload)
        : await createLesson(courseId, payload);

      if (lessonFile) {
        lesson = await uploadLessonThumbnail(lesson.id, lessonFile);
      }

      await refreshLessons();
      setEditingLesson(lesson);
      setLessonFile(null);
      setLessonPanelOpen(true);
      toast.success(editingLesson ? "Cập nhật bài học thành công" : "Thêm bài học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu bài học thất bại");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Nội dung khóa template</h3>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý module, bài học, media và bài tập mẫu không cần lớp học trung tâm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-50 text-violet-700">{modules.length} module</Badge>
          <Button type="button" onClick={openCreateModule}>
            <Plus className="h-4 w-4" />
            Thêm module
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        <aside className="space-y-3 xl:col-span-3">
          {modules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
              Chưa có module. Hãy thêm module đầu tiên cho khóa template.
            </div>
          ) : (
            modules.map((module) => (
              <details key={module.id} className="group rounded-2xl border border-gray-100 bg-gray-50/60 p-3" open>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-semibold text-gray-900">{module.title}</h4>
                      <Badge className={module.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                        {module.status === "active" ? "Mở" : "Ẩn"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{lessonsByModule[module.id]?.length ?? 0} bài học</p>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Button type="button" variant="outline" size="sm" onClick={() => openCreateLesson(module.id)}>
                    <Plus className="h-4 w-4" />
                    Bài học
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditModule(module)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={async () => {
                    try {
                      await deleteModule(module.id);
                      toast.success("Xóa module thành công");
                    } catch {
                      toast.error("Xóa module thất bại");
                    }
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 space-y-2">
                  {(lessonsByModule[module.id] ?? []).length === 0 ? (
                    <p className="rounded-xl bg-white px-3 py-3 text-xs text-gray-500">Module này chưa có bài học.</p>
                  ) : (
                    lessonsByModule[module.id].map((lesson) => {
                      const selected = editingLesson?.id === lesson.id;
                      return (
                        <div
                          key={lesson.id}
                          className={`rounded-xl border px-3 py-2 ${
                            selected ? "border-brand-200 bg-brand-50" : "border-gray-100 bg-white"
                          }`}
                        >
                          <button type="button" className="w-full text-left" onClick={() => openEditLesson(lesson)}>
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${selected ? "text-brand-700" : "text-gray-800"}`}>
                                {lesson.title}
                              </p>
                              <Badge className={lesson.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                                {lesson.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {lesson.estimated_duration_minutes ? `${lesson.estimated_duration_minutes} phút` : "Chưa có thời lượng"}
                            </p>
                          </button>
                          <div className="mt-2 flex justify-end">
                            <Button type="button" variant="ghost" size="sm" onClick={async () => {
                              try {
                                await deleteLesson(lesson.id);
                                if (editingLesson?.id === lesson.id) {
                                  setEditingLesson(null);
                                  setLessonPanelOpen(false);
                                  setLessonFile(null);
                                }
                                toast.success("Xóa bài học thành công");
                              } catch {
                                toast.error("Xóa bài học thất bại");
                              }
                            }}>
                              <Trash2 className="h-4 w-4" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </details>
            ))
          )}
        </aside>

        <section className="xl:col-span-9">
          {!lessonPanelOpen ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div>
                <p className="text-base font-semibold text-gray-900">Chọn một bài học để chỉnh sửa</p>
                <p className="mt-2 text-sm text-gray-500">
                  Bấm vào bài học ở danh sách bên trái hoặc thêm bài học mới từ một module.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học"}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">Chỉnh nội dung bài học, media và trạng thái xuất bản.</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setLessonPanelOpen(false);
                    setEditingLesson(null);
                    setLessonFile(null);
                  }}>
                    Đóng
                  </Button>
                  <Button type="button" onClick={() => void handleSaveLesson()}>Lưu bài học</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <FieldLabel>Module</FieldLabel>
                  <Select value={lessonForm.module_id || prefillModuleId} onValueChange={(value) => setLessonForm((prev) => ({ ...prev, module_id: value }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Chọn module" /></SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => <SelectItem key={module.id} value={module.id}>{module.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Trạng thái</FieldLabel>
                  <Select value={lessonForm.status} onValueChange={(value) => setLessonForm((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {lessonStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <FieldLabel>Tên bài học</FieldLabel>
                  <Input value={lessonForm.title} onChange={(event) => setLessonForm((prev) => ({ ...prev, title: event.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Thứ tự</FieldLabel>
                  <Input type="number" min={0} value={lessonForm.order_index} onChange={(event) => setLessonForm((prev) => ({ ...prev, order_index: event.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Thời lượng ước tính (phút)</FieldLabel>
                  <Input type="number" min={0} value={lessonForm.estimated_duration_minutes} onChange={(event) => setLessonForm((prev) => ({ ...prev, estimated_duration_minutes: event.target.value }))} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <FieldLabel>Mô tả ngắn</FieldLabel>
                  <Textarea value={lessonForm.description} rows={3} onChange={(event) => setLessonForm((prev) => ({ ...prev, description: event.target.value }))} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <FieldLabel>Nội dung bài học</FieldLabel>
                  <EditorJsField
                    key={`${lessonEditorKey}-${editingLesson?.id ?? "new"}`}
                    value={lessonForm.content}
                    onChange={(value) => setLessonForm((prev) => ({ ...prev, content: value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <FieldLabel>Ảnh hoặc video bài học</FieldLabel>
                  {editingLesson ? <MediaPreview media={editingLesson.thumbnail} /> : null}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    {lessonFile ? lessonFile.name : "Chọn file"}
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={(event) => setLessonFile(event.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>

              {editingLesson ? (
                <div className="border-t border-gray-100 pt-5">
                  <LessonAssignmentsPanel lesson={editingLesson} />
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  Lưu bài học trước khi thêm bài tập và câu hỏi.
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingModule ? "Chỉnh sửa module" : "Thêm module"}</DialogTitle>
            <DialogDescription>Nhập nội dung module và upload ảnh hoặc video đại diện.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Tên module</FieldLabel>
              <Input value={moduleForm.title} onChange={(event) => setModuleForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Mô tả module</FieldLabel>
              <Textarea value={moduleForm.description} rows={4} onChange={(event) => setModuleForm((prev) => ({ ...prev, description: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Thứ tự</FieldLabel>
              <Input type="number" min={0} value={moduleForm.order_index} onChange={(event) => setModuleForm((prev) => ({ ...prev, order_index: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Trạng thái</FieldLabel>
              <Select value={moduleForm.status} onValueChange={(value) => setModuleForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {moduleStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <FieldLabel>Ảnh hoặc video module</FieldLabel>
              {editingModule ? <MediaPreview media={editingModule.media} /> : null}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                {moduleFile ? moduleFile.name : "Chọn file"}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={(event) => setModuleFile(event.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModuleDialogOpen(false)}>Hủy</Button>
            <Button type="button" onClick={() => void handleSaveModule()}>Lưu module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

const LessonAssignmentsPanel = ({ lesson }: { lesson: any }) => {
  const { createLessonAssignment, listLessonAssignments, updateAssignment, deleteAssignment } = useAssignmentsStore();
  const { assignmentTypes } = useAssignmentTypesStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [form, setForm] = useState({
    title: "",
    assignment_type_id: "",
    description: "",
    instruction: "",
    status: "draft",
    max_score: "10",
    due_at: "",
    allow_late_submission: true,
  });

  const loadAssignments = async () => {
    const data = await listLessonAssignments(lesson.id, { page: 1, page_size: 100, sort_by: "created_at", sort_order: "desc" });
    setAssignments(data);
  };

  useEffect(() => {
    void loadAssignments().catch(() => toast.error("Không thể tải bài tập của bài học"));
  }, [lesson.id]);

  const openCreate = () => {
    setEditingAssignment(null);
    setForm({
      title: "",
      assignment_type_id: assignmentTypes[0]?.id || "",
      description: "",
      instruction: "",
      status: "draft",
      max_score: "10",
      due_at: "",
      allow_late_submission: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setForm({
      title: assignment.title,
      assignment_type_id: assignment.assignment_type_id,
      description: assignment.description || "",
      instruction: assignment.instruction || "",
      status: assignment.status,
      max_score: String(assignment.max_score),
      due_at: assignment.due_at ? assignment.due_at.slice(0, 16) : "",
      allow_late_submission: assignment.allow_late_submission,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.assignment_type_id) {
      toast.error("Vui lòng nhập tên và loại bài tập");
      return;
    }

    const payload: AssignmentCreateRequest = {
      title: form.title.trim(),
      assignment_type_id: form.assignment_type_id,
      description: form.description.trim() || null,
      instruction: form.instruction.trim() || null,
      status: form.status,
      max_score: Number(form.max_score || 10),
      due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
      allow_late_submission: form.allow_late_submission,
    };

    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, payload);
        toast.success("Cập nhật bài tập thành công");
      } else {
        await createLessonAssignment(lesson.id, payload);
        toast.success("Thêm bài tập thành công");
      }
      await loadAssignments();
      setDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu bài tập thất bại");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">Bài tập của bài học</p>
          <p className="text-xs text-gray-500">Bài tập template không cần class_id hoặc session_id.</p>
        </div>
        <Button type="button" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Thêm bài tập
        </Button>
      </div>

      {assignments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 p-3 text-sm text-gray-500">Chưa có bài tập.</p>
      ) : (
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <details key={assignment.id} className="rounded-lg border border-gray-200 bg-white p-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-xs text-gray-500">
                    {assignment.assignment_type?.name || "Chưa có loại"} · {assignment.status} · {assignment.max_score} điểm
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={(event) => {
                    event.preventDefault();
                    openEdit(assignment);
                  }}>Sửa</Button>
                  <Button type="button" variant="destructive" size="sm" onClick={async (event) => {
                    event.preventDefault();
                    try {
                      await deleteAssignment(assignment.id);
                      await loadAssignments();
                      toast.success("Xóa bài tập thành công");
                    } catch {
                      toast.error("Xóa bài tập thất bại");
                    }
                  }}>Xóa</Button>
                </div>
              </summary>
              <div className="mt-3 border-t border-gray-100 pt-3">
                <AssignmentQuestionsPanel assignment={assignment} />
              </div>
            </details>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingAssignment ? "Chỉnh sửa bài tập" : "Thêm bài tập"}</DialogTitle>
            <DialogDescription>Bài tập này gắn với lesson template, không cần lớp hoặc buổi học.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Tên bài tập</FieldLabel>
              <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Loại bài tập</FieldLabel>
              <Select value={form.assignment_type_id} onValueChange={(value) => setForm((prev) => ({ ...prev, assignment_type_id: value }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Chọn loại bài tập" /></SelectTrigger>
                <SelectContent>
                  {assignmentTypes.map((type) => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Trạng thái</FieldLabel>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {assignmentStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Điểm tối đa</FieldLabel>
              <Input type="number" min={0} value={form.max_score} onChange={(event) => setForm((prev) => ({ ...prev, max_score: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Hạn nộp</FieldLabel>
              <Input type="datetime-local" value={form.due_at} onChange={(event) => setForm((prev) => ({ ...prev, due_at: event.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Mô tả</FieldLabel>
              <Textarea value={form.description} rows={3} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Hướng dẫn làm bài</FieldLabel>
              <Textarea value={form.instruction} rows={5} onChange={(event) => setForm((prev) => ({ ...prev, instruction: event.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
              <input
                type="checkbox"
                checked={form.allow_late_submission}
                onChange={(event) => setForm((prev) => ({ ...prev, allow_late_submission: event.target.checked }))}
              />
              Cho phép nộp muộn
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button type="button" onClick={() => void handleSave()}>Lưu bài tập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AssignmentQuestionsPanel = ({ assignment }: { assignment: Assignment }) => {
  const { createQuestion, listQuestions, updateQuestion, deleteQuestion } = useAssignmentQuestionsStore();
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssignmentQuestion | null>(null);
  const [form, setForm] = useState({
    question_type: "single_choice",
    question_text: "",
    score: "0",
    order_index: "0",
    is_required: true,
  });

  const loadQuestions = async () => {
    const data = await listQuestions(assignment.id);
    setQuestions(data);
  };

  useEffect(() => {
    void loadQuestions().catch(() => toast.error("Không thể tải câu hỏi"));
  }, [assignment.id]);

  const openCreate = () => {
    setEditingQuestion(null);
    setForm({ question_type: "single_choice", question_text: "", score: "0", order_index: String(questions.length), is_required: true });
    setDialogOpen(true);
  };

  const openEdit = (question: AssignmentQuestion) => {
    setEditingQuestion(question);
    setForm({
      question_type: question.question_type,
      question_text: question.question_text,
      score: String(question.score),
      order_index: String(question.order_index),
      is_required: question.is_required,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.question_text.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    try {
      const payload = {
        question_type: form.question_type,
        question_text: form.question_text.trim(),
        score: Number(form.score || 0),
        order_index: Number(form.order_index || 0),
        is_required: form.is_required,
      };
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload);
        toast.success("Cập nhật câu hỏi thành công");
      } else {
        await createQuestion(assignment.id, payload);
        toast.success("Thêm câu hỏi thành công");
      }
      await loadQuestions();
      setDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu câu hỏi thất bại");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900">Câu hỏi</p>
        <Button type="button" size="sm" variant="outline" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Thêm câu hỏi
        </Button>
      </div>
      {questions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 p-3 text-sm text-gray-500">Chưa có câu hỏi.</p>
      ) : (
        <div className="space-y-2">
          {questions.map((question) => (
            <div key={question.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{question.question_text}</p>
                  <p className="mt-1 text-xs text-gray-500">{question.question_type} · {question.score} điểm</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(question)}>Sửa</Button>
                  <Button type="button" variant="destructive" size="sm" onClick={async () => {
                    try {
                      await deleteQuestion(question.id);
                      await loadQuestions();
                      toast.success("Xóa câu hỏi thành công");
                    } catch {
                      toast.error("Xóa câu hỏi thất bại");
                    }
                  }}>Xóa</Button>
                </div>
              </div>
              {isChoiceQuestion(question.question_type) ? (
                <QuestionOptionsEditor question={question} onChanged={loadQuestions} />
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}</DialogTitle>
            <DialogDescription>Loại trắc nghiệm sẽ có thêm phần quản lý đáp án.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <FieldLabel>Loại câu hỏi</FieldLabel>
              <Select value={form.question_type} onValueChange={(value) => setForm((prev) => ({ ...prev, question_type: value }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Điểm</FieldLabel>
              <Input type="number" min={0} value={form.score} onChange={(event) => setForm((prev) => ({ ...prev, score: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Thứ tự</FieldLabel>
              <Input type="number" min={0} value={form.order_index} onChange={(event) => setForm((prev) => ({ ...prev, order_index: event.target.value }))} />
            </div>
            <label className="flex items-center gap-2 pt-7 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_required}
                onChange={(event) => setForm((prev) => ({ ...prev, is_required: event.target.checked }))}
              />
              Bắt buộc trả lời
            </label>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Nội dung câu hỏi</FieldLabel>
              <Textarea rows={5} value={form.question_text} onChange={(event) => setForm((prev) => ({ ...prev, question_text: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button type="button" onClick={() => void handleSave()}>Lưu câu hỏi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const QuestionOptionsEditor = ({ question, onChanged }: { question: AssignmentQuestion; onChanged: () => Promise<void> }) => {
  const { createOption, updateOption, deleteOption } = useAssignmentQuestionOptionsStore();
  const [optionText, setOptionText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCreate = async () => {
    if (!optionText.trim()) {
      toast.error("Vui lòng nhập đáp án");
      return;
    }

    try {
      await createOption(question.id, {
        option_text: optionText.trim(),
        is_correct: isCorrect,
        order_index: question.options.length,
      });
      setOptionText("");
      setIsCorrect(false);
      await onChanged();
      toast.success("Thêm đáp án thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm đáp án thất bại");
    }
  };

  const handleToggleCorrect = async (option: AssignmentQuestionOption) => {
    try {
      await updateOption(option.id, { is_correct: !option.is_correct });
      await onChanged();
    } catch {
      toast.error("Cập nhật đáp án thất bại");
    }
  };

  return (
    <div className="mt-3 rounded-lg bg-gray-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Đáp án</p>
      <div className="space-y-2">
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={option.is_correct} onChange={() => void handleToggleCorrect(option)} />
              {option.option_text}
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={async () => {
              try {
                await deleteOption(option.id);
                await onChanged();
                toast.success("Xóa đáp án thành công");
              } catch {
                toast.error("Xóa đáp án thất bại");
              }
            }}>Xóa</Button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2 md:flex-row">
        <Input value={optionText} onChange={(event) => setOptionText(event.target.value)} placeholder="Nội dung đáp án" />
        <label className="flex shrink-0 items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isCorrect} onChange={(event) => setIsCorrect(event.target.checked)} />
          Đúng
        </label>
        <Button type="button" onClick={() => void handleCreate()}>Thêm đáp án</Button>
      </div>
    </div>
  );
};
