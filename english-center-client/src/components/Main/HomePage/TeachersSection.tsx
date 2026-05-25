import SectionHeading from "./SectionHeading";

const teachers = [
  {
    name: "Sarah Johnson",
    role: "Giáo viên IELTS",
    meta: "8 năm kinh nghiệm • Anh Quốc",
    image: "https://picsum.photos/seed/teacher-sarah/400/400.jpg",
  },
  {
    name: "Michael Brown",
    role: "Giáo viên Giao tiếp",
    meta: "5 năm kinh nghiệm • Mỹ",
    image: "https://picsum.photos/seed/teacher-mike/400/400.jpg",
  },
  {
    name: "Emma Wilson",
    role: "Giáo viên Trẻ Em",
    meta: "6 năm kinh nghiệm • Úc",
    image: "https://picsum.photos/seed/teacher-emma/400/400.jpg",
  },
  {
    name: "David Lee",
    role: "Giáo viên TOEIC",
    meta: "10 năm kinh nghiệm • Canada",
    image: "https://picsum.photos/seed/teacher-david/400/400.jpg",
  },
];

export default function TeachersSection() {
  return (
    <section id="teachers" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Đội ngũ giáo viên"
          title="Gặp gỡ"
          highlight="giáo viên"
          suffix="xuất sắc"
          description="Đội ngũ giáo viên bản ngữ giàu kinh nghiệm, tận tâm và đầy nhiệt huyết."
        />

        <div className="fade-up grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher) => (
            <article key={teacher.name} className="card-hover group text-center">
              <div className="mx-auto mb-5 h-48 w-48 overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {teacher.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-500">
                {teacher.role}
              </p>
              <p className="mt-2 text-xs text-gray-400">{teacher.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
