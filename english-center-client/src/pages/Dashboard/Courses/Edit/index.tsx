import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardCourseThumbnailField } from "@/components/Dashboard/Comon";
import { CourseCenterClassesSection } from "@/components/Dashboard/Courses/CourseCenterClassesSection";
import CourseBasicInfoForm from "@/components/Dashboard/Courses/CourseBasicInfoForm";
import CourseOutcomesEditor from "@/components/Dashboard/Courses/CourseOutcomesEditor";
import CourseRequirementsEditor from "@/components/Dashboard/Courses/CourseRequirementsEditor";
import { CourseTemplateModulesSection } from "@/components/Dashboard/Courses/CourseTemplateModulesSection";
import { Badge } from "@/components/ui/badge";
import { useClassesStore } from "@/services/classes/classes.store";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardCourseEditPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
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

    if (selectedCourse.mode === "center") {
      void listCourseClasses(courseId, { page: 1, page_size: 100, sort_by: "start_date", sort_order: "desc" }).catch(() =>
        toast.error("Không thể tải lớp học của khóa này"),
      );
    }
  }, [courseId, listCourseClasses, selectedCourse]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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
        <div className="inline-flex rounded-2xl border border-gray-100 bg-white p-1">
          <button type="button" onClick={() => setActiveTab("info")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "info" ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-gray-50"}`}>Thông tin</button>
          <button type="button" onClick={() => setActiveTab("content")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "content" ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-gray-50"}`}>{selectedCourse?.mode === "center" ? "Các lớp học" : "Module, bài học"}</button>
        </div>

        {activeTab === "info" ? (
          <>
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
          </>
        ) : null}

        {activeTab === "content" && selectedCourse?.mode === "template" ? (
          <CourseTemplateModulesSection courseId={courseId} />
        ) : null}

        {activeTab === "content" && selectedCourse?.mode === "center" ? (
          <CourseCenterClassesSection
            courseId={courseId}
            classes={classes}
            onCreateClass={async (payload) => {
              await createClass(payload);
            }}
            onDeleteClass={deleteClass}
          />
        ) : null}
      </div>
    </section>
  );
}
