import { X } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Đóng menu dashboard"
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/40"
      />
      <div className="relative h-full w-80 max-w-[86vw] bg-white shadow-2xl">
        <button
          type="button"
          aria-label="Đóng menu dashboard"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl bg-gray-50 p-2 text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        <DashboardSidebar className="block w-full border-r-0" />
      </div>
    </div>
  );
};
