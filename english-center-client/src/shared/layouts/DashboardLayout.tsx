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
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
