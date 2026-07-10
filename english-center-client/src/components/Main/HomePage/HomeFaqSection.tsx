import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs = [
  {
    question: "Tôi chưa biết trình độ hiện tại thì nên bắt đầu từ đâu?",
    answer:
      "Bạn sẽ bắt đầu bằng bài kiểm tra trình độ miễn phí 15 phút. Sau khi hoàn thành, đội ngũ giáo viên sẽ phân tích kết quả và đề xuất lộ trình học phù hợp với mục tiêu của bạn.",
  },
  {
    question: "Trung tâm có lớp học online không?",
    answer:
      "Có. FluentUp cung cấp cả lớp học offline tại trung tâm, lớp học online trực tiếp với giáo viên và hình thức hybrid linh hoạt. Bạn có thể chọn hình thức phù hợp nhất với lịch trình của mình.",
  },
  {
    question: "Một lớp có bao nhiêu học viên?",
    answer:
      "Lớp nhóm tối đa 8–12 học viên để đảm bảo mỗi người đều được tương tác trực tiếp với giáo viên. Ngoài ra, chúng tôi có lớp 1-1 dành cho học viên cần lộ trình cá nhân hóa cao.",
  },
  {
    question: "Tôi có thể thay đổi lịch học không?",
    answer:
      "Bạn có thể đổi lịch học trước 24 giờ qua ứng dụng FluentUp. Chúng tôi hiểu lịch trình của người đi làm và sinh viên rất bận rộn, nên luôn cố gắng tạo điều kiện linh hoạt nhất.",
  },
  {
    question: "Bao lâu tôi có thể thấy sự tiến bộ?",
    answer:
      "Hầu hết học viên thấy tiến bộ rõ rệt sau 8–12 tuần học đều đặn. Tiến độ cụ thể phụ thuộc vào trình độ ban đầu, tần suất học và mức độ thực hành. Bạn sẽ thấy báo cáo tiến bộ mỗi tuần.",
  },
  {
    question: "Có khóa học dành cho người mất gốc không?",
    answer:
      "Có. Chương trình English Foundation được thiết kế riêng cho người mới bắt đầu và người mất gốc, tập trung vào phát âm chuẩn, từ vựng cơ bản và ngữ pháp ứng dụng trước khi vào các chủ đề phức tạp hơn.",
  },
];


export default function HomeFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="js-reveal mx-auto mb-14 max-w-2xl translate-y-4 text-center opacity-0 transition-[opacity,transform] duration-[600ms]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Câu hỏi thường gặp</p>
          <h2 className="text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">Bạn muốn biết thêm?</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq: FaqItem, index: number) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.question} className="js-reveal translate-y-4 rounded-card border border-line bg-white opacity-0 transition-[opacity,transform] duration-[600ms]">
                <button type="button" className="flex w-full items-center justify-between p-5 text-left" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}>
                  <span className="text-[15px] font-medium text-ink">{faq.question}</span>
                  <ChevronDown className={`ml-4 h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-[350ms] ${isOpen ? "max-h-[280px]" : "max-h-0"}`}>
                  <p className="px-5 pb-5 text-[14px] leading-relaxed text-muted">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
