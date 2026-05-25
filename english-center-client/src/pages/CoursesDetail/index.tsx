import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  GraduationCap,
  Heart,
  PlayCircle,
  ShoppingCart,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const courseContent = {
  "kids-english": {
    title: "Tiếng Anh Trẻ Em",
    subtitle: "Nền tảng tiếng Anh vui nhộn cho bé 4-11 tuổi",
    image: "https://picsum.photos/seed/detail-kids/1200/720.jpg",
    price: 3500000,
    sessions: "36 buổi",
    level: "Cơ bản - Trung cấp",
    students: "1.200+ học viên",
    rating: 4.9,
  },
  "teen-english": {
    title: "Tiếng Anh Thiếu Niên",
    subtitle: "Phát triển toàn diện 4 kỹ năng cho học sinh 12-17 tuổi",
    image: "https://picsum.photos/seed/detail-teen/1200/720.jpg",
    price: 4800000,
    sessions: "48 buổi",
    level: "Tiền trung cấp - Trung cấp",
    students: "980+ học viên",
    rating: 4.8,
  },
  "ielts-prep": {
    title: "Luyện Thi IELTS",
    subtitle: "Lộ trình tăng band có chiến lược, bám sát đề thi thật",
    image: "https://picsum.photos/seed/detail-ielts/1200/720.jpg",
    price: 8500000,
    sessions: "60 buổi",
    level: "Intermediate - Advanced",
    students: "2.300+ học viên",
    rating: 5,
  },
} as const;

const overviewItems = [
  { icon: Clock3, label: "Thời lượng", value: "90 phút/buổi" },
  { icon: CalendarDays, label: "Lịch khai giảng", value: "Mỗi tuần" },
  { icon: Globe2, label: "Hình thức", value: "Online + Offline" },
  { icon: Users, label: "Sĩ số lớp", value: "12-16 học viên" },
];

const highlights = [
  "Giáo trình cập nhật theo chuẩn CEFR và Cambridge",
  "Theo dõi tiến bộ hằng tuần với báo cáo chi tiết",
  "Trợ giảng hỗ trợ ngoài giờ qua nhóm học tập riêng",
  "Thi thử định kỳ và đánh giá năng lực cuối khóa",
];

const outcomes = [
  "Nâng phản xạ nghe nói tự nhiên trong giao tiếp thực tế",
  "Mở rộng từ vựng theo chủ đề học tập và công việc",
  "Tự tin trình bày ý kiến và viết đoạn văn có cấu trúc",
  "Sẵn sàng bước vào các khóa luyện thi chuyên sâu",
];

export default function CourseDetailPage() {
  const { id = "ielts-prep" } = useParams();
  const navigate = useNavigate();

  const course = useMemo(() => {
    return (
      courseContent[id as keyof typeof courseContent] ?? courseContent["ielts-prep"]
    );
  }, [id]);

  return (
    <section className="hero-course-gradient relative overflow-hidden pb-24 pt-28">
      <div className="blob-a" />
      <div className="blob-b" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="transition-colors hover:text-brand-500"
          >
            Khóa học
          </button>
          <span>/</span>
          <span className="font-medium text-gray-700">{course.title}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="card-hover overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
            <div className="relative h-72 overflow-hidden sm:h-96">
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <button
                type="button"
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-600"
              >
                <PlayCircle className="h-4 w-4" />
                Xem video giới thiệu
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                <BookOpenCheck className="mr-1.5 h-3.5 w-3.5" />
                Lộ trình chuẩn hóa
              </div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
                {course.subtitle}
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
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-gray-100 pt-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Bạn sẽ nhận được</h2>
                <ul className="space-y-2">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Học phí khóa học
                  </p>
                  <p className="mt-1 text-3xl font-bold text-brand-600">
                    {course.price.toLocaleString("vi-VN")}
                    <span className="ml-1 text-xs font-normal text-gray-400">VNĐ</span>
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-2 text-right">
                  <p className="text-xs text-amber-600">Đánh giá</p>
                  <p className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {course.rating}/5
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl bg-gray-50 p-4 text-sm">
                <p className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-brand-500" />
                    Trình độ
                  </span>
                  <span className="font-medium text-gray-800">{course.level}</span>
                </p>
                <p className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-500" />
                    Học viên
                  </span>
                  <span className="font-medium text-gray-800">{course.students}</span>
                </p>
                <p className="flex items-center justify-between text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-brand-500" />
                    Số buổi
                  </span>
                  <span className="font-medium text-gray-800">{course.sessions}</span>
                </p>
              </div>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/wishlist")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
                >
                  <Heart className="h-4 w-4" />
                  Lưu vào yêu thích
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Kết quả đầu ra</h3>
              <ul className="space-y-2">
                {outcomes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
