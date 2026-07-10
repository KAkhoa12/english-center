import type { CourseListItem } from "@/services/courses/courses.type";
import { ArrowRight, BookOpen, Clock, PlayCircle, Tag, Video } from "lucide-react";
import { formatPrice } from "@/shared/helpers/price_format";

export default function CourseTemplateCard({
  course,
}: {
  course: CourseListItem;
}) {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A0: "border-mint text-mint-deep",
      A1: "border-mint text-mint-deep",
      A2: "border-sky text-sky-deep",
      B1: "border-sky text-sky-deep",
      B2: "border-coral text-coral",
      C1: "border-coral text-coral",
    };
    return colors[level] || "border-line text-caption";
  };

  return (
    <article className="group flex h-85 flex-col overflow-hidden rounded-card border border-line-soft bg-white transition-all duration-400 hover:-translate-y-1 hover:border-sky hover:shadow-[0_12px_24px_-12px_rgba(135,168,200,0.25)] md:flex-row">
      {/* THUMBNAIL */}
      <div className="relative w-full shrink-0 overflow-hidden bg-surface md:w-[220px] md:aspect-auto">
        <div className="aspect-16/10 h-full w-full md:aspect-auto md:h-full">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.name}
              className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-sky/20 to-hero-warm text-ink/60">
              <Tag className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
            <Video className="h-3 w-3" />
            HỌC ONLINE
          </span>
        </div>

        {course.target_level && (
          <div className="absolute right-3 top-3">
            <span
              className={`inline-flex items-center rounded-full border bg-white/95 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${getLevelColor(
                course.target_level
              )}`}
            >
              {course.target_level}
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <div className="flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-white/95 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <PlayCircle className="h-8 w-8 text-ink" />
          </div>
        </div>

        <div className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          <Clock className="mr-1 inline h-3 w-3" />
          {course.total_sessions ? `${course.total_sessions * 45} phút` : "Đang cập nhật"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
            {course.category.name}
          </span>
          {course.target_level && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getLevelColor(
                course.target_level
              )}`}
            >
              {course.target_level}
            </span>
          )}
        </div>

        <h2 className="mb-2 text-[18px] font-bold leading-tight text-ink lg:text-[20px]">
          {course.name}
        </h2>

        {course.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
            {course.description}
          </p>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-sky-deep" />
            <span>
              <strong className="text-ink">{course.total_sessions ?? 0}</strong> bài học
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-sky-deep" />
            <span>
              Truy cập <strong className="text-ink">trọn đời</strong>
            </span>
          </span>
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {course.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-line-soft bg-surface-soft px-2.5 py-1 text-[11px] font-medium text-muted"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <div className="text-[18px] font-bold tracking-tight text-ink lg:text-[20px]">
              {formatPrice(course.price)}
            </div>
            <div className="text-[11px] font-medium text-faint">/ toàn khóa học</div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-sky-deep"
          >
            Bắt đầu học
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
