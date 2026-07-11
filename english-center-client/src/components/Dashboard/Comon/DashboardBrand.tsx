import { BookOpen } from "lucide-react";
import logo from "@/assets/logo.svg";

export const DashboardBrand = () => {
  return (
    <a href="#" className="flex items-center gap-3">
      <img src={logo} alt="Logo" className="h-11 w-11" />
      <div>
        <div className="text-lg font-bold leading-none text-gray-950">
          Edu<span className="text-brand-500"> English</span>
        </div>
        <div className="mt-1 text-xs font-medium text-gray-400">
          Learning Dashboard
        </div>
      </div>
    </a>
  );
};
