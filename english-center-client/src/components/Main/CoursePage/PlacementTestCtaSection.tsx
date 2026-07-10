import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PlacementTestCtaSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute rounded-[50%] blur-[80px] pointer-events-none bg-[#F5E9D8]/30 w-[400px] h-[400px] -bottom-20 left-1/4"></div>

      <div className="container-max relative">
        <div className="max-w-4xl mx-auto bg-[#0A0A0A] rounded-2xl p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{"backgroundImage": "radial-gradient(circle at 20% 20%, #00D4A4 0%, transparent 40%), radial-gradient(circle at 80% 80%, #87A8C8 0%, transparent 40%)" }}></div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4A4]"></span>
              BẮT ĐẦU TỪ ĐÚNG TRÌNH ĐỘ
            </div>
            <h2 className="text-[clamp(28px,4vw,42px)] font-semibold text-white mb-4 headline-tight">
              Vẫn chưa tìm được khóa học phù hợp?
            </h2>
            <p className="text-[16px] text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
              Hoàn thành bài kiểm tra 15 phút để nhận đánh giá trình độ chi tiết và tư vấn lộ trình cá nhân hóa từ chuyên gia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="bg-mint  w-full sm:w-auto font-bold cursor-pointer"  size="lg">
                Kiểm tra trình độ miễn phí
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="text-white border border-white w-full sm:w-auto font-bold cursor-pointer"  size="lg">
                Nhận tư vấn lộ trình
              </Button>
            </div>
            <p className="text-xs text-white/40 mt-4">Không cần thẻ thanh toán · Nhận kết quả ngay</p>
          </div>
        </div>
      </div>
    </section>
  );
}
