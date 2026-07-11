import { SectionCard } from "@/components/Dashboard/Comon";

const courses = [
  {
    title: "IELTS Intensive 7.0",
    meta: "42/60 buổi",
    progress: 72,
    color: "bg-brand-500",
  },
  {
    title: "Business English",
    meta: "18/36 buổi",
    progress: 50,
    color: "bg-accent-500",
  },
  {
    title: "Pronunciation AI Lab",
    meta: "31/40 bài",
    progress: 78,
    color: "bg-coral-500",
  },
];

export const CourseProgress = () => {
  return (
    <SectionCard title="Khóa học đang theo">
      <div className="space-y-5">
        {courses.map((course) => (
          <div key={course.title}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-950">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{course.meta}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {course.progress}%
              </span>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${course.color}`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
