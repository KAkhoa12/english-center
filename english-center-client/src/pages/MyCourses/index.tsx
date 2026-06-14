import { BookOpen, CalendarDays, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useEnrollmentsStore } from "@/services/enrollments/enrollments.store";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Đang học", className: "bg-accent-50 text-accent-600" },
  completed: { label: "Hoàn thành", className: "bg-brand-50 text-brand-600" },
  cancelled: { label: "Đã hủy", className: "bg-red-50 text-red-600" },
  pending: { label: "Chờ xử lý", className: "bg-amber-50 text-amber-600" },
};

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { enrollments, isLoading, myEnrollments } = useEnrollmentsStore();

  useEffect(() => {
    void myEnrollments().catch(() => {
      toast.error("Không thể tải danh sách khóa học");
    });
  }, [myEnrollments]);

  return (
    <section className="bg-gray-50 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
            Khóa học của tôi
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Lộ trình học tập
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            Quản lý và theo dõi tiến độ các khóa học bạn đã đăng ký.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
              <BookOpen className="h-6 w-6 text-brand-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Chưa có khóa học nào</h2>
            <p className="mt-2 text-sm text-gray-500">
              Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học phù hợp với bạn.
            </p>
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const status = statusConfig[enrollment.enrollment_status] ?? {
                label: enrollment.enrollment_status,
                className: "bg-gray-100 text-gray-600",
              };

              return (
                <article
                  key={enrollment.id}
                  className="card-hover overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={enrollment.course.thumbnail_url || "https://picsum.photos/seed/mycourse/600/400.jpg"}
                      alt={enrollment.course.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-3 top-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
                        {enrollment.course.code}
                      </span>
                    </div>
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                      {enrollment.course.name}
                    </h2>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-brand-500" />
                        Đăng ký: {new Date(enrollment.enrolled_at).toLocaleDateString("vi-VN")}
                      </p>
                      {enrollment.order_id ? (
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent-500" />
                          Đã thanh toán
                        </p>
                      ) : (
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          Chưa thanh toán
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/course/${enrollment.course.id}`)}
                      className="mt-5 w-full rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
                    >
                      Xem chi tiết khóa học
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
