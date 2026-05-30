import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardCourseThumbnailField } from "@/components/Dashboard/Comon";
import CourseBasicInfoForm from "@/components/Dashboard/Courses/CourseBasicInfoForm";
import CourseOutcomesEditor from "@/components/Dashboard/Courses/CourseOutcomesEditor";
import CourseRequirementsEditor from "@/components/Dashboard/Courses/CourseRequirementsEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClassesStore } from "@/services/classes/classes.store";
import { useCourseModulesStore } from "@/services/courseModules/courseModules.store";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { useLessonsStore } from "@/services/lessons/lessons.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

const emptyLessonForm = {
  module_id: "",
  title: "",
  description: "",
  content: "",
  estimated_duration_minutes: "",
  status: "draft",
};

const emptyClassForm = {
  name: "",
  code: "",
  class_type: "offline",
  max_students: "20",
  start_date: "",
  end_date: "",
  status: "planned",
};

export default function DashboardCourseEditPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [classForm, setClassForm] = useState(emptyClassForm);

  const {
    selectedCourse,
    requirements,
    outcomes,
    isLoading,
    error,
    getCourse,
    updateCourse,
    uploadCourseThumbnail,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    createOutcome,
    updateOutcome,
    deleteOutcome,
    clearSelectedCourse,
    clearError,
  } = useCoursesStore();
  const { categories, listCategories } = useCoursesCategoryStore();
  const { modules, listModules, createModule, deleteModule } = useCourseModulesStore();
  const { lessons, listLessons, createLesson, deleteLesson } = useLessonsStore();
  const { classes, listCourseClasses, createClass, deleteClass } = useClassesStore();

  useEffect(() => {
    void listCategories({ page: 1, page_size: 100, status: "active", sort_by: "name", sort_order: "asc" });
  }, [listCategories]);

  useEffect(() => {
    if (!courseId) {
      toast.error("Thiếu mã khóa học");
      navigate(PRIVATE_ROUTES.DASHBOARD_COURSES);
      return;
    }

    void getCourse(courseId).catch(() => {
      toast.error("Không thể tải chi tiết khóa học");
    });

    return () => {
      clearSelectedCourse();
      clearError();
    };
  }, [courseId, getCourse, clearSelectedCourse, clearError, navigate]);

  useEffect(() => {
    if (!courseId || !selectedCourse) return;

    if (selectedCourse.mode === "template") {
      void listModules(courseId).catch(() => toast.error("Không thể tải module khóa học"));
      void listLessons(courseId, { page: 1, page_size: 200, sort_by: "order_index", sort_order: "asc" }).catch(() =>
        toast.error("Không thể tải bài học"),
      );
      return;
    }

    if (selectedCourse.mode === "center") {
      void listCourseClasses(courseId, { page: 1, page_size: 100, sort_by: "start_date", sort_order: "desc" }).catch(() =>
        toast.error("Không thể tải lớp học của khóa này"),
      );
    }
  }, [courseId, listCourseClasses, listLessons, listModules, selectedCourse]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const lessonsByModule = useMemo(() => {
    return lessons.reduce<Record<string, typeof lessons>>((acc, lesson) => {
      const key = lesson.module_id || "none";
      acc[key] = acc[key] || [];
      acc[key].push(lesson);
      return acc;
    }, {});
  }, [lessons]);

  const handleCreateModule = async () => {
    if (!moduleTitle.trim()) {
      toast.error("Vui lòng nhập tên module");
      return;
    }
    try {
      await createModule(courseId, {
        title: moduleTitle.trim(),
        description: moduleDescription.trim() || null,
        order_index: modules.length,
      });
      setModuleTitle("");
      setModuleDescription("");
      toast.success("Thêm module thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm module thất bại");
    }
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.module_id || !lessonForm.title.trim()) {
      toast.error("Vui lòng chọn module và nhập tên bài học");
      return;
    }
    try {
      await createLesson(courseId, {
        module_id: lessonForm.module_id,
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim() || null,
        content: lessonForm.content.trim() || null,
        estimated_duration_minutes: lessonForm.estimated_duration_minutes ? Number(lessonForm.estimated_duration_minutes) : null,
        order_index: lessonsByModule[lessonForm.module_id]?.length ?? 0,
      });
      setLessonForm(emptyLessonForm);
      toast.success("Thêm bài học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm bài học thất bại");
    }
  };

  const handleCreateClass = async () => {
    if (!classForm.name.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }
    try {
      await createClass({
        course_id: courseId,
        name: classForm.name.trim(),
        code: classForm.code.trim() || null,
        class_type: classForm.class_type,
        max_students: Number(classForm.max_students || 1),
        start_date: classForm.start_date || null,
        end_date: classForm.end_date || null,
        status: classForm.status,
      });
      setClassForm(emptyClassForm);
      toast.success("Thêm lớp học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm lớp học thất bại");
    }
  };

  if (!courseId) return null;

  return (
    <section>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Chỉnh sửa khóa học</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sau khi lưu thông tin cơ bản, nội dung phía dưới sẽ thay đổi theo mode của khóa học.
          </p>
        </div>
        {selectedCourse ? (
          <Badge className={selectedCourse.mode === "center" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"}>
            {selectedCourse.mode === "center" ? "Center - quản lý lớp học" : "Template - module/bài học"}
          </Badge>
        ) : null}
      </div>

      <div className="space-y-5">
        <DashboardCourseThumbnailField
          currentImageUrl={selectedCourse?.thumbnail_url}
          file={thumbnailFile}
          onFileChange={setThumbnailFile}
          disabled={isLoading}
        />

        <CourseBasicInfoForm
          course={selectedCourse}
          categories={categories}
          loading={isLoading}
          onSubmit={async (payload) => {
            try {
              await updateCourse(courseId, payload);
              if (thumbnailFile) {
                await uploadCourseThumbnail(courseId, thumbnailFile);
                setThumbnailFile(null);
              }
              toast.success("Cập nhật khóa học thành công");
            } catch {
              toast.error("Cập nhật khóa học thất bại");
            }
          }}
        />

        <div className="grid gap-5 xl:grid-cols-2">
          <CourseRequirementsEditor
            items={requirements}
            loading={isLoading}
            onCreate={async (text) => {
              try {
                await createRequirement(courseId, { requirement_text: text, order_index: requirements.length + 1 });
                toast.success("Thêm yêu cầu thành công");
              } catch {
                toast.error("Thêm yêu cầu thất bại");
              }
            }}
            onUpdate={async (id, text, orderIndex) => {
              try {
                await updateRequirement(id, { requirement_text: text, order_index: orderIndex });
                toast.success("Cập nhật yêu cầu thành công");
              } catch {
                toast.error("Cập nhật yêu cầu thất bại");
              }
            }}
            onDelete={async (id) => {
              try {
                await deleteRequirement(id);
                toast.success("Xóa yêu cầu thành công");
              } catch {
                toast.error("Xóa yêu cầu thất bại");
              }
            }}
          />

          <CourseOutcomesEditor
            items={outcomes}
            loading={isLoading}
            onCreate={async (text) => {
              try {
                await createOutcome(courseId, { outcome_text: text, order_index: outcomes.length + 1 });
                toast.success("Thêm kết quả đầu ra thành công");
              } catch {
                toast.error("Thêm kết quả đầu ra thất bại");
              }
            }}
            onUpdate={async (id, text, orderIndex) => {
              try {
                await updateOutcome(id, { outcome_text: text, order_index: orderIndex });
                toast.success("Cập nhật kết quả đầu ra thành công");
              } catch {
                toast.error("Cập nhật kết quả đầu ra thất bại");
              }
            }}
            onDelete={async (id) => {
              try {
                await deleteOutcome(id);
                toast.success("Xóa kết quả đầu ra thành công");
              } catch {
                toast.error("Xóa kết quả đầu ra thất bại");
              }
            }}
          />
        </div>

        {selectedCourse?.mode === "template" ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Nội dung khóa template</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Template course không tạo lớp. Quản trị nội dung bằng module và bài học.
                </p>
              </div>
              <Badge className="bg-violet-50 text-violet-700">{modules.length} module</Badge>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 lg:grid-cols-[1fr_1fr_auto]">
              <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="Tên module" />
              <Input value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} placeholder="Mô tả module" />
              <Button type="button" onClick={() => void handleCreateModule()}>
                <Plus className="h-4 w-4" />
                Thêm module
              </Button>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-dashed border-gray-200 p-4 lg:grid-cols-2">
              <Select value={lessonForm.module_id} onValueChange={(value) => setLessonForm((prev) => ({ ...prev, module_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn module cho bài học" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={lessonForm.title} onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tên bài học" />
              <Input
                type="number"
                min={0}
                value={lessonForm.estimated_duration_minutes}
                onChange={(e) => setLessonForm((prev) => ({ ...prev, estimated_duration_minutes: e.target.value }))}
                placeholder="Thời lượng ước tính (phút)"
              />
              <Input
                value={lessonForm.description}
                onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả ngắn"
              />
              <Textarea
                value={lessonForm.content}
                onChange={(e) => setLessonForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Nội dung bài học"
                rows={3}
                className="lg:col-span-2"
              />
              <div className="flex justify-end lg:col-span-2">
                <Button type="button" onClick={() => void handleCreateLesson()}>
                  <Plus className="h-4 w-4" />
                  Thêm bài học
                </Button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {modules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                  Chưa có module. Hãy thêm module đầu tiên cho khóa template.
                </div>
              ) : (
                modules.map((module) => (
                  <article key={module.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        <p className="mt-1 text-sm text-gray-500">{module.description || "Chưa có mô tả"}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await deleteModule(module.id);
                            toast.success("Xóa module thành công");
                          } catch {
                            toast.error("Xóa module thất bại");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(lessonsByModule[module.id] ?? []).length === 0 ? (
                        <p className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-500">Module này chưa có bài học.</p>
                      ) : (
                        lessonsByModule[module.id].map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                              <p className="text-xs text-gray-500">
                                {lesson.estimated_duration_minutes ? `${lesson.estimated_duration_minutes} phút` : "Chưa có thời lượng"} · {lesson.status}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                try {
                                  await deleteLesson(lesson.id);
                                  toast.success("Xóa bài học thành công");
                                } catch {
                                  toast.error("Xóa bài học thất bại");
                                }
                              }}
                            >
                              Xóa
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : null}

        {selectedCourse?.mode === "center" ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lớp học của khóa center</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Center course cần tạo lớp để học viên chọn lớp khi thêm vào giỏ hàng.
                </p>
              </div>
              <Badge className="bg-blue-50 text-blue-700">{classes.length} lớp</Badge>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 md:grid-cols-2 xl:grid-cols-4">
              <Input value={classForm.name} onChange={(e) => setClassForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên lớp" />
              <Input value={classForm.code} onChange={(e) => setClassForm((prev) => ({ ...prev, code: e.target.value }))} placeholder="Mã lớp" />
              <Select value={classForm.class_type} onValueChange={(value) => setClassForm((prev) => ({ ...prev, class_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Hình thức lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                value={classForm.max_students}
                onChange={(e) => setClassForm((prev) => ({ ...prev, max_students: e.target.value }))}
                placeholder="Sĩ số tối đa"
              />
              <Input type="date" value={classForm.start_date} onChange={(e) => setClassForm((prev) => ({ ...prev, start_date: e.target.value }))} />
              <Input type="date" value={classForm.end_date} onChange={(e) => setClassForm((prev) => ({ ...prev, end_date: e.target.value }))} />
              <Select value={classForm.status} onValueChange={(value) => setClassForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">planned</SelectItem>
                  <SelectItem value="ongoing">ongoing</SelectItem>
                  <SelectItem value="completed">completed</SelectItem>
                  <SelectItem value="cancelled">cancelled</SelectItem>
                  <SelectItem value="archived">archived</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => void handleCreateClass()}>
                <Plus className="h-4 w-4" />
                Thêm lớp
              </Button>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {classes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 lg:col-span-2">
                  Chưa có lớp nào cho khóa center này.
                </div>
              ) : (
                classes.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.code || "Chưa có mã lớp"} · {item.class_type} · {item.status}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.current_students_count}/{item.max_students} học viên
                          {item.start_date ? ` · Bắt đầu ${new Date(item.start_date).toLocaleDateString("vi-VN")}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", item.id))}
                        >
                          Sửa
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            try {
                              await deleteClass(item.id);
                              toast.success("Xóa lớp thành công");
                            } catch {
                              toast.error("Xóa lớp thất bại");
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
