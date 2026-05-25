import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardCourseThumbnailField } from "@/components/Dashboard/Comon";
import CourseBasicInfoForm from "@/components/Dashboard/Courses/CourseBasicInfoForm";
import CourseOutcomesEditor from "@/components/Dashboard/Courses/CourseOutcomesEditor";
import CourseRequirementsEditor from "@/components/Dashboard/Courses/CourseRequirementsEditor";
import { useCoursesStore } from "@/services/courses/courses.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardCourseEditPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
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
    if (error) toast.error(error);
  }, [error]);

  if (!courseId) return null;

  return (
    <section>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Chỉnh sửa khóa học
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Cập nhật thông tin cơ bản, yêu cầu đầu vào và kết quả đầu ra.
          </p>
        </div>
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
                await createRequirement(courseId, {
                  requirement_text: text,
                  order_index: requirements.length + 1,
                });
                toast.success("Thêm yêu cầu thành công");
              } catch {
                toast.error("Thêm yêu cầu thất bại");
              }
            }}
            onUpdate={async (id, text, orderIndex) => {
              try {
                await updateRequirement(id, {
                  requirement_text: text,
                  order_index: orderIndex,
                });
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
                await createOutcome(courseId, {
                  outcome_text: text,
                  order_index: outcomes.length + 1,
                });
                toast.success("Thêm kết quả đầu ra thành công");
              } catch {
                toast.error("Thêm kết quả đầu ra thất bại");
              }
            }}
            onUpdate={async (id, text, orderIndex) => {
              try {
                await updateOutcome(id, {
                  outcome_text: text,
                  order_index: orderIndex,
                });
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
    </section>
  );
}
