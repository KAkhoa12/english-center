import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

const contactItems = [
  {
    title: "Địa chỉ",
    value: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    Icon: MapPin,
  },
  {
    title: "Hotline",
    value: "1900 1234 (8:00 - 21:00 hàng ngày)",
    Icon: Phone,
  },
  {
    title: "Email",
    value: "info@starenglish.edu.vn",
    Icon: Mail,
  },
];

const courseOptions = [
  "Tiếng Anh Trẻ Em",
  "Tiếng Anh Thiếu Niên",
  "Luyện Thi IELTS",
  "Giao Tiếp Ứng Dụng",
  "Tiếng Anh Thương Mại",
  "Luyện Thi TOEIC",
];

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitted(false);

    window.setTimeout(() => {
      event.currentTarget.reset();
      setIsSubmitting(false);
      setSubmitted(true);

      window.setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  }

  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="fade-up">
            <span className="mb-4 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-500">
              Liên hệ
            </span>
            <h2 className="mb-6 text-3xl font-bold leading-[0.95] tracking-tight text-gray-900 sm:text-5xl">
              Đăng ký{" "}
              <span className="gradient-text font-serif-display font-normal italic">
                tư vấn
              </span>{" "}
              miễn phí
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-gray-500">
              Để lại thông tin, chúng tôi sẽ liên hệ tư vấn lộ trình học phù
              hợp nhất cho bạn trong vòng 24h.
            </p>

            <div className="space-y-6">
              {contactItems.map(({ title, value, Icon }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50">
                    <Icon className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-gray-100 bg-gray-50 p-8 lg:p-10"
            >
              <div className="mb-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all"
                />
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Khóa học quan tâm
                </label>
                <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 transition-all">
                  <option value="">-- Chọn khóa học --</option>
                  {courseOptions.map((course) => (
                    <option key={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lời nhắn
                </label>
                <textarea
                  rows={4}
                  placeholder="Chia sẻ thêm nhu cầu học tập của bạn..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-4 font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Đang gửi..." : "Gửi đăng ký tư vấn"}
              </button>
              {submitted ? (
                <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4 text-center text-sm text-accent-700">
                  Đăng ký thành công! Chúng tôi sẽ liên hệ bạn trong vòng 24
                  giờ.
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
