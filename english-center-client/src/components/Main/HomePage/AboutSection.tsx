import { GraduationCap, Trophy, Users, Zap } from "lucide-react";
import SectionHeading from "./SectionHeading";

const features = [
  {
    title: "Giáo viên bản ngữ",
    description:
      "100% giáo viên có chứng chỉ quốc tế TEFL/TESOL và kinh nghiệm giảng dạy từ 3 năm trở lên.",
    Icon: GraduationCap,
    card: "from-brand-50 border-brand-100/50",
    icon: "bg-brand-100 text-brand-500 group-hover:bg-brand-500",
  },
  {
    title: "Lớp học nhỏ",
    description:
      "Tối đa 12 học viên/lớp giúp giáo viên theo sát tiến độ từng cá nhân.",
    Icon: Users,
    card: "from-green-50 border-green-100/50",
    icon: "bg-green-100 text-accent-500 group-hover:bg-accent-500",
  },
  {
    title: "Công nghệ AI",
    description:
      "Ứng dụng AI chấm điểm phát âm, theo dõi tiến độ học tập thông minh mỗi ngày.",
    Icon: Zap,
    card: "from-amber-50 border-amber-100/50",
    icon: "bg-amber-100 text-sun-500 group-hover:bg-sun-500",
  },
  {
    title: "Cam kết đầu ra",
    description:
      "Đảm bảo đạt mục tiêu chứng chỉ, học lại miễn phí nếu chưa đạt theo cam kết.",
    Icon: Trophy,
    card: "from-orange-50 border-orange-100/50",
    icon: "bg-orange-100 text-coral-500 group-hover:bg-coral-500",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Về chúng tôi"
          title="Tại sao chọn"
          highlight="StarEnglish?"
          description="Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến môi trường học tập tiếng Anh tốt nhất cho mọi lứa tuổi."
        />

        <div className="fade-up grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, Icon, card, icon }) => (
            <div
              key={title}
              className={`card-hover group rounded-2xl border bg-gradient-to-br to-white p-8 ${card}`}
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${icon}`}
              >
                <Icon className="h-7 w-7 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
