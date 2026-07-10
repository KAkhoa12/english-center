import { Briefcase } from "lucide-react";

export default function HomeTeachersSection() {
  const teachers = [
    ["Nguyễn Minh Anh", "IELTS & Academic English", "8 năm kinh nghiệm", "IELTS 8.5", "CELTA", "teacher-minh-anh-portrait"],
    ["Daniel Walker", "English Communication", "10 năm kinh nghiệm", "TESOL", "Native Speaker", "teacher-daniel-walker-portrait"],
    ["Trần Khánh Linh", "English Foundation", "6 năm kinh nghiệm", "IELTS 8.0", "TESOL", "teacher-khanh-linh-portrait"],
  ];

  return (
    <section id="teachers" className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl js-reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-[600ms]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Đội ngũ giáo viên</p>
          <h2 className="text-section font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Giáo viên không chỉ dạy.
            <br />
            Họ đồng hành cùng bạn.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {teachers.map(([name, role, exp, cert1, cert2, seed]) => (
            <div key={name} className="js-reveal translate-y-4 overflow-hidden rounded-card border border-line bg-white opacity-0 transition-[opacity,transform] duration-[600ms] hover:-translate-y-0.5 hover:border-hover-line hover:shadow-card-hover">
              <div className="group relative aspect-[4/5] overflow-hidden">
                <img src={`https://picsum.photos/seed/${seed}/500/620.jpg`} alt={name} className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]" />
              </div>
              <div className="p-5">
                <h3 className="text-[18px] font-semibold text-ink">{name}</h3>
                <p className="mt-1 text-sm text-muted">{role}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-caption">
                  <Briefcase className="h-3.5 w-3.5" /> {exp}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line-soft pt-4">
                  <span className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body">{cert1}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-body">{cert2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
