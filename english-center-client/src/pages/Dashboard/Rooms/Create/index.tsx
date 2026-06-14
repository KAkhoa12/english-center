import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardRoomCreatePage() {
  const navigate = useNavigate();
  const { createRoom } = useRoomsStore();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(20);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("active");

  const handleSubmit = async () => {
    try {
      await createRoom({ name, capacity, location: location || null, status });
      toast.success("Tạo phòng học thành công");
      navigate(PRIVATE_ROUTES.DASHBOARD_ROOMS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tạo phòng học thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tạo phòng học" description="Thêm phòng học mới" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">Tên phòng<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nhập tên phòng" /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700">Sức chứa<Input type="number" min={1} value={capacity} onChange={(event) => setCapacity(Number(event.target.value || 1))} /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700">Vị trí<Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Nhập vị trí" /></label>
          <label className="space-y-2 text-sm font-medium text-gray-700">Trạng thái<Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Đang hoạt động</SelectItem><SelectItem value="maintenance">Bảo trì</SelectItem><SelectItem value="inactive">Ngừng hoạt động</SelectItem></SelectContent></Select></label>
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button><Button onClick={() => void handleSubmit()}>Lưu</Button></div>
      </div>
    </section>
  );
}
