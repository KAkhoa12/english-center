import { Building, Clock3, Tag, Users } from "lucide-react";
import { Link } from "react-router-dom";

import type { CourseListItem } from "@/services/courses/courses.type";
import { PUBLIC_ROUTES } from "@/shared/routes";

interface CourseCenterCardProps {
  course: CourseListItem;
}

export default function CourseCenterCard({ course }: CourseCenterCardProps) {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A0: "border-mint text-mint-deep bg-mint/5",
      A1: "border-mint text-mint-deep bg-mint/5",
      A2: "border-sky text-sky-deep bg-sky/5",
      B1: "border-sky text-sky-deep bg-sky/5",
      B2: "border-coral text-coral bg-coral/5",
      C1: "border-coral text-coral bg-coral/5",
    };
    return colors[level] || "border-line text-caption bg-surface";
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line-soft bg-white transition-all duration-400 hover:-translate-y-1.5 hover:border-mint hover:shadow-featured">
      {/* Thumbnail */}
      <div className="relative aspect-16/10 overflow-hidden bg-surface">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.name}
            className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-hero-mid to-hero-warm text-ink/70">
            <Tag className="h-12 w-12" />
          </div>
        )}

        {/* Badge: TẠI TRUNG TÂM */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-[11px] font-semibold text-ink shadow-sm">
            <Building className="h-3 w-3" />
            TẠI TRUNG TÂM
          </span>
        </div>

        {/* Level badge */}
        {course.target_level && (
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${getLevelColor(
                course.target_level
              )}`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            >
              {course.target_level}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        {/* Category */}
        <div className="mb-3">
          <span className="inline-flex rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
            {course.category?.name ?? "Khóa học"}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-[20px] font-bold leading-tight text-ink">
          {course.name}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
            {course.description}
          </p>
        )}

        {/* Info grid */}
        <div className="mb-4 grid grid-cols-2 gap-3 border-b border-line-soft pb-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock3 className="h-4 w-4 text-mint-deep" />
            <span>
              <strong className="text-ink">{course.total_sessions ?? 0}</strong>{" "}
              buổi học
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Users className="h-4 w-4 text-mint-deep" />
            <span>
              Lớp <strong className="text-ink">nhỏ ≤12</strong> HV
            </span>
          </div>
        </div>

        {/* Tags */}
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

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <div className="text-[20px] font-bold tracking-tight text-ink">
              {course.price > 0
                ? `${new Intl.NumberFormat("vi-VN").format(course.price)}đ`
                : "Liên hệ"}
            </div>
            <div className="text-[11px] font-medium text-faint">
              / toàn khóa
            </div>
          </div>
          <Link
            to={PUBLIC_ROUTES.COURSE_DETAIL.replace(":id", course.id)}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-mint-deep"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
