import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: "kids-english",
    title: "Tiếng Anh Trẻ Em",
    audience: "4-11 tuổi",
    duration: "36 buổi",
    price: "3.500.000",
    image: "https://picsum.photos/seed/kids-english/600/400.jpg",
    alt: "Tiếng Anh trẻ em",
    badge: "Phổ biến",
    badgeClass: "course-badge",
    tagClass: "text-accent-600 bg-accent-50",
    description:
      "Phương pháp học qua trò chơi, bài hát giúp bé yêu thích tiếng Anh tự nhiên.",
  },
  {
    id: "teen-english",
    title: "Tiếng Anh Thiếu Niên",
    audience: "12-17 tuổi",
    duration: "48 buổi",
    price: "4.800.000",
    image: "https://picsum.photos/seed/teen-study/600/400.jpg",
    alt: "Tiếng Anh thiếu niên",
    badge: "Mới",
    badgeClass: "bg-accent-500",
    tagClass: "text-accent-600 bg-accent-50",
    description:
      "Phát triển 4 kỹ năng toàn diện, rèn luyện tư duy phản biện bằng tiếng Anh.",
  },
  {
    id: "ielts-prep",
    title: "Luyện Thi IELTS",
    audience: "18+ tuổi",
    duration: "60 buổi",
    price: "8.500.000",
    image: "https://picsum.photos/seed/ielts-prep/600/400.jpg",
    alt: "Luyện thi IELTS",
    badge: "Hot",
    badgeClass: "bg-coral-500",
    tagClass: "text-coral-500 bg-orange-50",
    description:
      "Chiến thuật làm bài hiệu quả, thực hành đề thật, cam kết đạt band mục tiêu.",
  },
  {
    id: "conversation",
    title: "Giao Tiếp Ứng Dụng",
    audience: "Người lớn",
    duration: "36 buổi",
    price: "5.200.000",
    image: "https://picsum.photos/seed/communication-engl/600/400.jpg",
    alt: "Giao tiếp",
    tagClass: "text-brand-500 bg-brand-50",
    description:
      "Tự tin giao tiếp trong công việc và đời sống với phương pháp thực hành liên tục.",
  },
  {
    id: "business-english",
    title: "Tiếng Anh Thương Mại",
    audience: "Doanh nghiệp",
    duration: "48 buổi",
    price: "7.800.000",
    image: "https://picsum.photos/seed/business-eng/600/400.jpg",
    alt: "Tiếng Anh thương mại",
    tagClass: "text-brand-500 bg-brand-50",
    description:
      "Email, thuyết trình, đàm phán - kỹ năng tiếng Anh chuyên sâu cho dân văn phòng.",
  },
  {
    id: "toeic-prep",
    title: "Luyện Thi TOEIC",
    audience: "Sinh viên",
    duration: "48 buổi",
    price: "6.200.000",
    image: "https://picsum.photos/seed/toeic-exam/600/400.jpg",
    alt: "Luyện thi TOEIC",
    tagClass: "text-sun-500 bg-amber-50",
    description:
      "Tập trung Reading & Listening, mẹo làm bài nhanh, đạt 750+ dễ dàng.",
  },
];

export default function CoursesPage() {
  const navigate = useNavigate();

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
              key={course.title}
              className="card-hover group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {course.badge ? (
                  <div className="absolute left-4 top-4">
                    <span
                      className={`${course.badgeClass} rounded-full px-3 py-1.5 text-xs font-semibold text-white`}
                    >
                      {course.badge}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${course.tagClass}`}
                  >
                    {course.audience}
                  </span>
                  <span className="text-xs font-medium text-gray-400">•</span>
                  <span className="text-xs font-medium text-gray-500">
                    {course.duration}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {course.title}
                </h2>
                <p className="mb-5 text-sm leading-relaxed text-gray-500">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-brand-600">
                      {course.price}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">VNĐ/khóa</span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Xem ${course.title}`}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-all hover:bg-brand-500 hover:text-white"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
