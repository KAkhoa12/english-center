import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  DashboardHeader,
  DashboardSidebar,
  MobileSidebar,
} from "@/components/Dashboard/Comon";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="px-2 py-2 sm:px-2 lg:px-2">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
