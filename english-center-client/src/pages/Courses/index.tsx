import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCoursesStore } from "@/services/courses/courses.store";
import type { CourseListItem, CourseMode } from "@/services/courses/courses.type";

const levelTagClass: Record<string, string> = {
  A0: "text-brand-500 bg-brand-50",
  A1: "text-brand-500 bg-brand-50",
  A2: "text-accent-600 bg-accent-50",
  B1: "text-accent-600 bg-accent-50",
  B2: "text-coral-500 bg-orange-50",
  C1: "text-sun-500 bg-amber-50",
  C2: "text-sun-500 bg-amber-50",
};

const sectionCopy: Record<CourseMode, { eyebrow: string; title: string; description: string }> = {
  center: {
    eyebrow: "Khóa học được đăng ký và học tại trung tâm",
    title: "Học theo lớp, có giáo viên chuyên nghiệp đồng hành hướng dẫn",
    description: "Các khóa đang mở lớp tại trung tâm, phù hợp khi bạn cần lộ trình rõ ràng và lịch học cố định.",
  },
  template: {
    eyebrow: "Khóa học đang bán học theo bài học có sẵn ",
    title: "Tự học theo các bài học đã thiết kế",
    description: "Nội dung học được đóng gói theo mục tiêu, thuận tiện để học lại và ôn tập linh hoạt.",
  },
};

const CourseCard = ({ course }: { course: CourseListItem }) => {
  const navigate = useNavigate();

  return (
    <article className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-brand-50">
        <img
          src={course.thumbnail_url || "https://picsum.photos/seed/course-fallback/600/400.jpg"}
          alt={course.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
          {course.mode === "center" ? "Center" : "Template"}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${levelTagClass[course.target_level ?? ""] || "bg-gray-100 text-gray-600"}`}>
            {course.target_level || "Tổng quát"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
            {course.mode === "center" ? <CalendarDays className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
            {course.total_sessions ? `${course.total_sessions} buổi` : "Đang cập nhật"}
          </span>
        </div>
        <div>
          <h2 className="line-clamp-2 text-xl font-semibold text-gray-950">{course.name}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {course.description || "Khóa học đang được cập nhật mô tả chi tiết."}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Học phí</p>
            <p className="text-xl font-bold text-brand-600">{course.price.toLocaleString("vi-VN")} <span className="text-xs font-medium text-gray-400">VNĐ</span></p>
          </div>
          <button
            type="button"
            aria-label={`Xem ${course.name}`}
            onClick={() => navigate(`/course/${course.slug || course.id}`)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-950 text-white transition-all hover:bg-brand-600"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

const CourseSection = ({ mode, courses, loading }: { mode: CourseMode; courses: CourseListItem[]; loading: boolean }) => {
  const copy = sectionCopy[mode];

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">{copy.eyebrow}</p>
          <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">{copy.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">{copy.description}</p>
        </div>
        <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">{courses.length} khóa học</span>
      </div>
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-[28px] bg-white" />)}
        </div>
      ) : courses.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Chưa có khóa học khả dụng.</div>
      )}
    </section>
  );
};

export default function CoursesPage() {
  const { listCoursesRaw } = useCoursesStore();
  const [centerCourses, setCenterCourses] = useState<CourseListItem[]>([]);
  const [templateCourses, setTemplateCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    Promise.all([
      listCoursesRaw({ page: 1, page_size: 12, status: "active", mode: "center" }),
      listCoursesRaw({ page: 1, page_size: 12, status: "active", mode: "template" }),
    ])
      .then(([center, template]) => {
        if (!mounted) return;
        setCenterCourses(center);
        setTemplateCourses(template);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [listCoursesRaw]);

  return (
    <section className="relative overflow-hidden bg-gray-50 pb-24 pt-32">
      <div className="blob-3" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">Danh mục khóa học</p>
          <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl">Chọn khóa học phù hợp mục tiêu của bạn</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Lộ trình học được chia rõ theo hình thức học tại trung tâm và template tự học để bạn dễ chọn hơn.
          </p>
        </div>

        <CourseSection mode="center" courses={centerCourses} loading={isLoading} />
        <CourseSection mode="template" courses={templateCourses} loading={isLoading} />
      </div>
    </section>
  );
}
