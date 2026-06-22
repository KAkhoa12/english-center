import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardConfirmDeleteDialog, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { GuestEnrollmentsListTable } from "@/components/Dashboard/GuestEnrollments/GuestEnrollmentsListTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGuestEnrollmentsStore } from "@/services/guestEnrollments/guestEnrollments.store";
import type { GuestEnrollment } from "@/services/guestEnrollments/guestEnrollments.type";

const emptyForm = {
  content: "",
};

export default function DashboardGuestEnrollmentsPage() {
  const {
    guestEnrollments,
    pagination,
    isLoading,
    listGuestEnrollments,
    createGuestEnrollment,
    updateGuestEnrollment,
    deleteGuestEnrollment,
  } = useGuestEnrollmentsStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingItem, setEditingItem] = useState<GuestEnrollment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GuestEnrollment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void listGuestEnrollments({
      page,
      page_size: pageSize,
      search: searchKeyword.trim() || undefined,
      sort_by: "created_at",
      sort_order: "desc",
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải khách vãng lai"));
  }, [listGuestEnrollments, page, pageSize, searchKeyword]);

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (item: GuestEnrollment) => {
    setEditingItem(item);
    setForm({ content: item.content });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    const content = form.content.trim();
    if (!content) {
      toast.error("Vui lòng nhập nội dung khách vãng lai");
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        await updateGuestEnrollment(editingItem.id, { content });
        toast.success("Cập nhật khách vãng lai thành công");
      } else {
        await createGuestEnrollment({ content });
        toast.success("Tạo khách vãng lai thành công");
      }
      setFormOpen(false);
      setForm(emptyForm);
      setEditingItem(null);
      void listGuestEnrollments({ page, page_size: pageSize, search: searchKeyword.trim() || undefined });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu khách vãng lai thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGuestEnrollment(deleteTarget.id);
      toast.success("Xóa khách vãng lai thành công");
      setDeleteTarget(null);
      void listGuestEnrollments({ page, page_size: pageSize, search: searchKeyword.trim() || undefined });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa khách vãng lai thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Khách vãng lai"
        description="Quản lý thông tin khách để tư vấn viên liên hệ và hỗ trợ đăng ký lớp"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            setSearchKeyword(searchInput);
            setPage(1);
          }}
          placeholder="Tìm theo nội dung tư vấn"
          className="max-w-sm"
        />
        <Button
          type="button"
          onClick={() => {
            setSearchKeyword(searchInput);
            setPage(1);
          }}
        >
          Tìm kiếm
        </Button>
        <Button type="button" variant="outline" onClick={openCreateForm}>
          Thêm khách vãng lai
        </Button>
      </div>

      <GuestEnrollmentsListTable
        data={guestEnrollments}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl" showCloseButton={!submitting}>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Cập nhật khách vãng lai" : "Thêm khách vãng lai"}</DialogTitle>
            <DialogDescription>
              Nội dung nên gồm tên, số điện thoại, khóa/lớp quan tâm và ghi chú tư vấn nếu có.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={form.content}
            disabled={submitting}
            onChange={(event) => setForm({ content: event.target.value })}
            placeholder="Ví dụ: Anh Nam, 090..., quan tâm IELTS Foundation, muốn học buổi sáng..."
            className="min-h-40"
          />
          <DialogFooter>
            <Button type="button" variant="outline" disabled={submitting} onClick={() => setFormOpen(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={submitting} onClick={() => void handleSubmit()}>
              {editingItem ? "Lưu cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Xóa khách vãng lai"
        description="Bạn có chắc chắn muốn xóa thông tin khách vãng lai này?"
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
