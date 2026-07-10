import logo from "@/assets/logo.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink pt-20 pb-10 text-white">
      <div className="mx-auto w-full container px-5 sm:px-8">
        <div className="mb-14 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <img src={logo} alt="FluentUp English" className="h-8 w-8 bg-white rounded-sm" />
              <span className="text-[15px] font-semibold">du English</span>
            </Link>
            <p className="max-w-xs text-[14px] leading-relaxed text-white/60">Học đúng lộ trình. Tiến bộ mỗi ngày.</p>
            <div className="mt-6 flex items-center gap-3">

            </div>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Khóa học</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Foundation", "Communication", "IELTS", "Business English"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Học tập</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Kiểm tra trình độ", "Lộ trình học", "Học online", "Tài nguyên"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Về FluentUp</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Giáo viên", "Câu chuyện học viên", "Tuyển dụng", "Liên hệ"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              {["Trung tâm trợ giúp", "Chính sách học phí", "Điều khoản", "Bảo mật"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[13px] text-white/50">© 2026 FluentUp English. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[12px] text-white/40">
            <span className="h-2 w-2 rounded-full bg-mint" />
            Hoạt động bình thường · Tất cả hệ thống đang ổn định
          </div>
        </div>
      </div>
    </footer>
  );
}
