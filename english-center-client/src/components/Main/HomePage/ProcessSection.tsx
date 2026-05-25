import SectionHeading from "./SectionHeading";

const steps = [
  ["1", "Kiểm tra trình độ", "Làm bài test miễn phí để xác định trình độ hiện tại của bạn."],
  ["2", "Tư vấn lộ trình", "Chuyên viên tư vấn cá nhân hóa lộ trình học phù hợp."],
  ["3", "Học & Thực hành", "Tham gia lớp học, thực hành giao tiếp và làm bài tập AI."],
  ["✓", "Đạt mục tiêu", "Nhận chứng chỉ, tự tin giao tiếp và mở rộng cơ hội."],
];

export default function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-brand-50/50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Quy trình"
          title="4 bước"
          highlight="bắt đầu"
          suffix="hành trình"
          badgeClassName="bg-brand-100"
        />

        <div className="fade-up grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description], index) => (
            <div key={title} className="relative text-center">
              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ${
                  index === steps.length - 1
                    ? "bg-accent-500 shadow-accent-500/25"
                    : "course-badge shadow-brand-500/25"
                }`}
              >
                {number}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {description}
              </p>
              {index < steps.length - 1 ? (
                <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-brand-200 lg:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
