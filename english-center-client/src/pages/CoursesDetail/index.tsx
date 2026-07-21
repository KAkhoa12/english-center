import {
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Clock3,
  Globe2,
  GraduationCap,
  Heart,
  Infinity,
  MapPin,
  ShoppingCart,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/services/auth/auth.store";
import { useClassesStore } from "@/services/classes/classes.store";
import type { ClassItem } from "@/services/classes/classes.type";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useWishlistStore } from "@/services/wishlist/wishlist.store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import SkeletonCourseDetail from "@/components/Main/CourseDetail/SkeletonCourseDetail";
import MediaView from "@/components/Comon/MediaView";
import { getLevelLabel } from "@/shared/types/level";
const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "Đang cập nhật";

const modeLabel = (mode?: string | null) =>
  mode === "template" ? "Khóa tự học" : mode === "center" ? "Học tại trung tâm" : "Đang cập nhật";

const classStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    planned: "Sắp khai giảng",
    ongoing: "Đang học",
    completed: "Đã kết thúc",
    cancelled: "Đã hủy",
    archived: "Đã lưu trữ",
  };
  return labels[status] || status;
};

const canSelectClass = (item: ClassItem) =>
  !["completed", "cancelled", "archived"].includes(item.status) &&
  item.current_students_count < item.max_students;

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedCourse, isLoading, getCourse, clearSelectedCourse } = useCoursesStore();
  const { classes, isLoading: isLoadingClasses, listPublicCourseClasses } = useClassesStore();
  const { addWishlist, getWishlistStatus, favorited } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const [addingWishlist, setAddingWishlist] = useState(false);
  const addingCart = false;
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [classLoadError, setClassLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void getCourse(id);
    return () => {
      clearSelectedCourse();
    };
  }, [getCourse, clearSelectedCourse]);

  useEffect(() => {
    if (!selectedCourse || !isAuthenticated) return;
    void getWishlistStatus(selectedCourse.id);
  }, [getWishlistStatus, isAuthenticated, selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || selectedCourse.mode !== "center") return;

    setSelectedClassId("");
    setClassLoadError(null);
    void listPublicCourseClasses(selectedCourse.id, {
      page: 1,
      page_size: 20,
      sort_by: "start_date",
      sort_order: "asc",
      status:"planned"
    }).catch((error) => {
      setClassLoadError(error instanceof Error ? error.message : "Không thể tải danh sách lớp");
    });
  }, [listPublicCourseClasses, selectedCourse]);

  const handleAddToCart = async () => {
    toast.success("Tính năng đang phát triển");
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu yêu thích");
      void navigate("/login");
      return;
    }
    if (!selectedCourse) return;

    try {
      setAddingWishlist(true);
      await addWishlist({ course_id: selectedCourse.id });
      toast.success("Đã lưu vào danh sách yêu thích");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu yêu thích thất bại");
    } finally {
      setAddingWishlist(false);
    }
  };

  if (isLoading) {
    return <SkeletonCourseDetail />;
  }

  if (!selectedCourse) {
    return (
      <section className="relative overflow-hidden bg-gray-50 pb-24 pt-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-gray-500">Không tìm thấy khóa học.</p>
        </div>
      </section>
    );
  }

  const isFavorited = isAuthenticated ? favorited[selectedCourse.id] ?? false : false;
  const isCenterCourse = selectedCourse.mode === "center";
  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const overviewItems = [
    { icon: Globe2, label: "Hình thức", value: modeLabel(selectedCourse.mode) },
    { icon: GraduationCap, label: "Trình độ", value: selectedCourse.target_level || "Tổng quát" },
    isCenterCourse
      ? {
          icon: Clock3,
          label: "Số buổi",
          value: selectedCourse.total_sessions ? `${selectedCourse.total_sessions} buổi` : "Đang cập nhật",
        }
      : {
          icon: Users,
          label: "Số bài học",
          value: `${selectedCourse.lessons_count ?? 0} bài học`,
        },
  ];

  return (
    <section className="z-10 mx-auto container pt-20">
      <Breadcrumb className="py-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/courses">Khóa học</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{selectedCourse.name}</BreadcrumbLink>
            </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-12 gap-7">
        <article className="col-span-8 overflow-hidden rounded-3xl ">
          <MediaView
            type="image"
            links={[selectedCourse.thumbnail_url || "https://picsum.photos/seed/course-detail/1200/720.jpg"]}
            height={500}
          />
          <div className="my-4">
            <p className="text-xs font-medium text-muted mb-2">{selectedCourse.category?.name ?? "Đang cập nhật"}</p>
            <h1 className="text-[28px] md:text-[36px] font-bold text-ink leading-tight tracking-tight mb-3">
              {selectedCourse.name}
            </h1>
            <p className="text-[15px] text-muted leading-relaxed ">
              {selectedCourse.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-4 border-y border-line mb-6">
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <Target className="w-4 h-4 text-faint" />
               Trình độ {getLevelLabel(selectedCourse.target_level)}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <BookOpen className="w-4 h-4 text-faint" />
              21 bài học
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <Clock className="w-4 h-4 text-faint" />
              Học linh hoạt
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <Infinity className="w-4 h-4 text-faint" />
              Truy cập vĩnh viễn
            </span>
          </div>

            <div className="p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                <BookOpenCheck className="mr-1.5 h-3.5 w-3.5" />
                Lộ trình chuẩn hóa
              </div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {selectedCourse.name}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
                {selectedCourse.description || "Khóa học đang được cập nhật mô tả chi tiết."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {overviewItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <p className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                      <item.icon className="h-4 w-4 text-brand-500" />
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-gray-100 pt-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Yêu cầu đầu vào</h2>
                <ul className="space-y-2">
                  {(selectedCourse.requirements?.length
                    ? selectedCourse.requirements
                        .slice()
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((r) => r.requirement_text)
                    : ["Hoàn thành bài kiểm tra đầu vào", "Đảm bảo thời gian học theo lộ trình của khóa"]
                  ).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 border-t border-gray-100 pt-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Kết quả đầu ra</h2>
                <ul className="space-y-2">
                  {(selectedCourse.outcomes?.length
                    ? selectedCourse.outcomes
                        .slice()
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((o) => o.outcome_text)
                    : ["Nâng phản xạ nghe nói tự nhiên", "Mở rộng từ vựng theo chủ đề", "Tự tin trình bày ý kiến", "Sẵn sàng luyện thi chuyên sâu"]
                  ).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <aside className="col-span-4 ">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Học phí khóa học
                  </p>
                  <p className="mt-1 text-3xl font-bold text-brand-600">
                    {selectedCourse.price.toLocaleString("vi-VN")}
                    <span className="ml-1 text-xs font-normal text-gray-400">VNĐ</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl bg-gray-50 p-4 text-sm">
                <p className="flex items-center justify-between gap-4 text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-500" />
                    Loại khóa
                  </span>
                  <span className="text-right font-medium text-gray-800">
                    {modeLabel(selectedCourse.mode)}
                  </span>
                </p>
                <p className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-brand-500" />
                    Trình độ
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedCourse.target_level || "Tổng quát"}
                  </span>
                </p>
                <p className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-500" />
                    Danh mục
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedCourse.category?.name || "Đang cập nhật"}
                  </span>
                </p>
                {isCenterCourse ? <p className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-brand-500" />
                    Số buổi
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedCourse.total_sessions ? `${selectedCourse.total_sessions} buổi` : "Đang cập nhật"}
                  </span>
                </p> : null}
              </div>

              {isCenterCourse ? (
              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Chọn lớp học tại trung tâm
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {isAuthenticated
                      ? "Khóa học tại trung tâm cần chọn lớp trước khi thêm vào giỏ hàng."
                      : "Bạn có thể xem các lớp đang mở. Đăng nhập để chọn lớp và đăng ký."}
                  </p>
                </div>

                {isLoadingClasses ? (
                    <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                      Đang tải danh sách lớp...
                    </div>
                  ) : classLoadError ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                      {classLoadError}
                    </div>
                  ) : classes.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 p-3 text-sm text-gray-500">
                      Hiện chưa có lớp phù hợp để đăng ký.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {classes.map((classItem) => {
                        const available = canSelectClass(classItem);
                        const selected = selectedClassId === classItem.id;
                        return (
                          <button
                            key={classItem.id}
                            type="button"
                            disabled={!isAuthenticated || !available}
                            onClick={() => {
                              if (isAuthenticated) setSelectedClassId(classItem.id);
                            }}
                            className={`w-full rounded-xl border p-3 text-left transition-colors ${
                              selected
                                ? "border-brand-500 bg-brand-50"
                                : "border-gray-100 bg-gray-50 hover:border-brand-200"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{classItem.name}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Mã lớp: {classItem.code || "Chưa có"} · {classStatusLabel(classItem.status)}
                                </p>
                              </div>
                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                                {classItem.current_students_count}/{classItem.max_students}
                              </span>
                            </div>
                            <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                              <span>Khai giảng: {formatDate(classItem.start_date)}</span>
                              <span>Loại lớp: {classItem.class_type}</span>
                              <span>Giáo viên: {classItem.teacher?.full_name || "Đang cập nhật"}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                )}
              </div>
              ) : null}

              {isCenterCourse && selectedClass ? (
                <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
                  <p className="font-semibold">Lớp đã chọn: {selectedClass.name}</p>
                  <p className="mt-1">
                    {selectedClass.code || "Chưa có mã lớp"} · khai giảng {formatDate(selectedClass.start_date)}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingCart || (isCenterCourse && !selectedClassId)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addingCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                </button>
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  disabled={addingWishlist}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                    isFavorited
                      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-brand-200 bg-white text-brand-600 hover:bg-brand-50"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                  {isFavorited ? "Đã lưu yêu thích" : addingWishlist ? "Đang lưu..." : "Lưu vào yêu thích"}
                </button>
              </div>
            </div>

            {!isCenterCourse ? <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Nội dung khóa học</h3>
              <ul className="mb-4 space-y-2">
                {(selectedCourse.modules?.length
                  ? selectedCourse.modules
                      .slice()
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((m) => `${m.title}${m.description ? `: ${m.description}` : ""}`)
                  : ["Nội dung module đang được cập nhật"]
                ).map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div> : null}
          </aside>
      </div>
    </section>
  );
}
