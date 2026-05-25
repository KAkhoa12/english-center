import { BookOpen } from "lucide-react";

export const DashboardBrand = () => {
  return (
    <a href="#" className="flex items-center gap-3">
      <div className="course-badge flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-brand-500/25">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="text-lg font-bold leading-none text-gray-950">
          Star<span className="text-brand-500">English</span>
        </div>
        <div className="mt-1 text-xs font-medium text-gray-400">
          Learning Dashboard
        </div>
      </div>
    </a>
  );
};
