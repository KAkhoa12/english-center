import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    quote:
      "Từ band 4.5 lên 7.0 IELTS chỉ sau 6 tháng. Giáo viên tại StarEnglish rất tận tâm, phương pháp học hiệu quả và thú vị. Highly recommended!",
    name: "Nguyễn Minh Linh",
    role: "Sinh viên ĐH Ngoại Thương",
    image: "https://picsum.photos/seed/student-linh/80/80.jpg",
  },
  {
    quote:
      "Con mình rất thích đến lớp! Cô Emma dạy rất vui, bé tự tin giao tiếp tiếng Anh hơn hẳn. Cảm ơn StarEnglish rất nhiều.",
    name: "Trần Thu Hòa",
    role: "Phụ huynh học viên lớp Super Kids",
    image: "https://picsum.photos/seed/parent-hoa/80/80.jpg",
  },
  {
    quote:
      "Khóa Tiếng Anh Thương Mại giúp tôi tự tin email và thuyết trình với khách quốc tế. Đã recommend cho 5 đồng nghiệp rồi!",
    name: "Phạm Anh Tuấn",
    role: "Quản lý, Công ty FPT Software",
    image: "https://picsum.photos/seed/student-tuan/80/80.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Học viên nói gì"
          title="Câu chuyện"
          highlight="thành công"
        />

        <div className="fade-up grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="testimonial-card card-hover rounded-3xl border border-brand-100/50 p-8"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 fill-current text-sun-500"
                  />
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-gray-600">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
