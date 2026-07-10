
export default function HomeTrustMetricsSection() {
  const metrics = [
    ["12,000+", "Học viên đã tham gia"],
    ["96%", "Học viên hoàn thành lộ trình"],
    ["4.9/5", "Đánh giá từ học viên"],
    ["150+", "Giáo viên và trợ giảng"],
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="js-reveal mb-12 translate-y-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted opacity-0 transition-[opacity,transform] duration-[600ms]">
          Đồng hành cùng hàng nghìn học viên
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
          {metrics.map(([value, label]) => (
            <div key={label} className="js-reveal translate-y-4 text-center opacity-0 transition-[opacity,transform] duration-[600ms]">
              <div className="text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[52px]">{value}</div>
              <div className="mt-1 text-sm text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
