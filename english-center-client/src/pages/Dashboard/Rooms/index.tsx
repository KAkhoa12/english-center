import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { RoomsListTable } from "@/components/Dashboard/Rooms/RoomsListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoomsStore } from "@/services/rooms/rooms.store";
import type { Room } from "@/services/rooms/rooms.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardRoomsPage() {
  const navigate = useNavigate();
  const { rooms, pagination, isLoading, listRooms, deleteRoom } = useRoomsStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  useEffect(() => {
    void listRooms({
      page,
      page_size: pageSize,
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      sort_by: "created_at",
      sort_order: "desc",
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải danh sách phòng học"));
  }, [listRooms, page, pageSize, search, status]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRoom(deleteTarget.id);
      toast.success("Xóa phòng học thành công");
      setDeleteTarget(null);
      void listRooms({ page, page_size: pageSize });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa phòng học thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Quản lý phòng học" description="Quản lý phòng học dùng cho các buổi học" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm theo tên phòng" className="max-w-sm" />
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="maintenance">Bảo trì</SelectItem>
            <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_ROOMS_CREATE)}>Thêm phòng học</Button>
      </div>
      <RoomsListTable
        data={rooms}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
        onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_ROOMS_EDIT.replace(":roomId", item.id))}
        onDelete={setDeleteTarget}
      />
      <DashboardConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Xóa phòng học"
        description={`Bạn có chắc chắn muốn xóa phòng ${deleteTarget?.name ?? "này"}?`}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
