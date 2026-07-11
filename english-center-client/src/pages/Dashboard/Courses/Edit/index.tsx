import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Info, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import CourseBasicInfoForm from "@/components/Dashboard/Courses/CourseBasicInfoForm";
import CourseOutcomesEditor from "@/components/Dashboard/Courses/CourseOutcomesEditor";
import CourseRequirementsEditor from "@/components/Dashboard/Courses/CourseRequirementsEditor";
import { ImagePicker, MutilImagePicker } from "@/components/Comon/MediaPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClassesStore } from "@/services/classes/classes.store";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { PRIVATE_ROUTES } from "@/shared/routes";
import CourseCenter from "../components/CourseCenter";
import CourseTemplate from "../components/CourseTemplate";

export default function DashboardCourseEditPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "content">("info");

  const {
    selectedCourse,
    requirements,
    outcomes,
    isLoading,
    error,
    getCourse,
    updateCourse,
    uploadCourseThumbnail,
    uploadCourseMediaMany,
    deleteCourseMedia,
    updateCourseMedia,
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
  const { classes, listCourseClasses, createClass, deleteClass, updateClass } = useClassesStore();

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
    if (selectedCourse.mode === "center") {
      void listCourseClasses(courseId, { page: 1, page_size: 100, sort_by: "start_date", sort_order: "desc" }).catch(() =>
        toast.error("Không thể tải lớp học của khóa này"),
      );
    }
  }, [courseId, listCourseClasses, selectedCourse]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const courseMediaItems =
    selectedCourse?.media?.flatMap((item, index) => {
      const media = (item.media ?? {}) as Record<string, unknown>;
      const src = typeof media.url === "string" ? media.url : null;
      if (!src) return [];
      return [
        {
          id: item.id,
          name:
            typeof media.original_filename === "string"
              ? media.original_filename
              : typeof media.object_name === "string"
                ? media.object_name
                : `Ảnh ${index + 1}`,
          src,
          is_primary: item.is_primary,
        },
      ];
    }) ?? [];

  if (!courseId) return null;

  return (
    <div className="w-full pb-16">
      <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/80 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_COURSES)}
              className="h-8 w-8 rounded-md border-slate-200 text-slate-600 shrink-0 shadow-none hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 truncate tracking-tight">
                  {selectedCourse?.name || "Chỉnh sửa khóa học"}
                </h2>
                {selectedCourse && (
                  <Badge className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 shadow-none pointer-events-none rounded-sm border",
                    selectedCourse.mode === "center"
                      ? "bg-blue-50 text-blue-700 border-blue-200/60"
                      : "bg-violet-50 text-violet-700 border-violet-200/60"
                  )}>
                    {selectedCourse.mode === "center" ? "Mô hình Trung tâm" : "Mô hình Lộ trình tự do"}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">Mã ID: {courseId}</p>
            </div>
          </div>
          {activeTab === "info" && selectedCourse ? (
            <Button
              type="submit"
              form="course-basic-info-form"
              disabled={isLoading}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              Lưu thay đổi
            </Button>
          ) : null}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 space-y-6">
        <div className="border-b border-slate-200 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all rounded-t-sm",
              activeTab === "info"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
            )}
          >
            <Info className="h-3.5 w-3.5" />
            Thông tin tổng quan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all rounded-t-sm",
              activeTab === "content"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            {selectedCourse?.mode === "center" ? "Quản lý lớp học đính kèm" : "Cấu trúc Module & Bài học"}
          </button>
        </div>

        {activeTab === "info" && selectedCourse ? (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-6">
                <CourseBasicInfoForm
                  formId="course-basic-info-form"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="space-y-6">
              <ImagePicker
                currentUrl={selectedCourse?.thumbnail_url}
                file={thumbnailFile}
                onFileChange={setThumbnailFile}
                disabled={isLoading}
                label="Ảnh đại diện"
                description=""
              />

                <div className="overflow-visible">
                  <MutilImagePicker
                    label="Thư viện ảnh khóa học"
                    description="Quản lý kho tư liệu hình ảnh phục vụ quảng bá khóa học"
                    files={galleryFiles}
                    onFilesChange={setGalleryFiles}
                    items={courseMediaItems}
                    onUploadFiles={async (files) => {
                      await uploadCourseMediaMany(courseId, files);
                    }}
                    onDeleteItem={async (itemId) => {
                      await deleteCourseMedia(itemId);
                    }}
                    onSetPrimary={async (itemId) => {
                      await updateCourseMedia(itemId, { is_primary: true });
                      await getCourse(courseId);
                    }}
                    disabled={isLoading}
                    maxFiles={20}
                    uploadLabel="Tải ảnh"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "content" && (
          <div className="w-full bg-white border border-slate-200 rounded-md p-6 shadow-none animate-in fade-in duration-150">
            {selectedCourse?.mode === "template" && <CourseTemplate courseId={courseId} />}
            {selectedCourse?.mode === "center" && (
              <CourseCenter
                courseId={courseId}
                courseName={selectedCourse.name}
                classes={classes}
                onUpdateClass={async (classId, payload) => {
                  await updateClass(classId, payload);
                }}
                onCreateClass={async (payload) => {
                  await createClass(payload);
                }}
                onDeleteClass={deleteClass}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
