import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

type AuthBrandProps = {
  dark?: boolean;
};

export const AuthBrand = ({ dark = false }: AuthBrandProps) => {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <div className="course-badge flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-brand-500/25">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <div>
        <div
          className={`text-xl font-bold leading-none ${
            dark ? "text-white" : "text-gray-950"
          }`}
        >
          Star<span className="text-brand-500">English</span>
        </div>
        <div
          className={`mt-1 text-xs font-semibold uppercase tracking-widest ${
            dark ? "text-white/45" : "text-gray-400"
          }`}
        >
          English Center
        </div>
      </div>
    </Link>
  );
};
