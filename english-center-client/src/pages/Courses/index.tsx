import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCoursesStore } from "@/services/courses/courses.store";

const levelTagClass: Record<string, string> = {
  A0: "text-brand-500 bg-brand-50",
  A1: "text-brand-500 bg-brand-50",
  A2: "text-accent-600 bg-accent-50",
  B1: "text-accent-600 bg-accent-50",
  B2: "text-coral-500 bg-orange-50",
  C1: "text-sun-500 bg-amber-50",
  C2: "text-sun-500 bg-amber-50",
};

export default function CoursesPage() {
  const navigate = useNavigate();
  const { courses, listCourses, isLoading } = useCoursesStore();

  useEffect(() => {
    void listCourses({ page: 1, page_size: 12, status: "active" });
  }, [listCourses]);

  return (
    <section className="relative overflow-hidden bg-gray-50 pb-24 pt-32">
      <div className="blob-3" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
            Danh mục khóa học
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Chọn khóa học phù hợp mục tiêu của bạn
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Lộ trình học được thiết kế theo độ tuổi và nhu cầu thực tế, từ giao tiếp
            hằng ngày đến luyện thi chứng chỉ quốc tế.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="card-hover group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={course.thumbnail_url || "https://picsum.photos/seed/course-fallback/600/400.jpg"}
                  alt={course.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      levelTagClass[course.target_level ?? ""] || "text-brand-500 bg-brand-50"
                    }`}
                  >
                    {course.target_level || "Tổng quát"}
                  </span>
                  <span className="text-xs font-medium text-gray-400">•</span>
                  <span className="text-xs font-medium text-gray-500">
                    {course.total_sessions ? `${course.total_sessions} buổi` : "Đang cập nhật"}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {course.name}
                </h2>
                <p className="mb-5 text-sm leading-relaxed text-gray-500">
                  {course.description || "Khóa học đang được cập nhật mô tả chi tiết."}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-brand-600">
                      {course.price.toLocaleString("vi-VN")}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">VNĐ/khóa</span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Xem ${course.name}`}
                    onClick={() => navigate(`/course/${course.slug || course.id}`)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-all hover:bg-brand-500 hover:text-white"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!isLoading && courses.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">Chưa có khóa học khả dụng.</p>
        ) : null}
      </div>
    </section>
  );
}
