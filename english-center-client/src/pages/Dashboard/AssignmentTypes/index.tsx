import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAssignmentTypesStore } from "@/services/assignmentTypes/assignmentTypes.store";
import type { AssignmentType } from "@/services/assignmentTypes/assignmentTypes.type";

const defaultForm = {
  code: "",
  name: "",
  description: "",
  is_auto_gradable: false,
  requires_file_submission: false,
  allow_text_submission: true,
  allow_file_submission: false,
  status: "active",
};

type FormState = typeof defaultForm;

const booleanFields: Array<[keyof FormState, string]> = [
  ["is_auto_gradable", "Tự động chấm điểm"],
  ["requires_file_submission", "Bắt buộc nộp file"],
  ["allow_text_submission", "Cho phép nộp text"],
  ["allow_file_submission", "Cho phép nộp file"],
];

export default function DashboardAssignmentTypesPage() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AssignmentType | null>(null);
  const [deleting, setDeleting] = useState<AssignmentType | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);
  const { assignmentTypes, isLoading, listAssignmentTypes, createAssignmentType, updateAssignmentType, deleteAssignmentType } = useAssignmentTypesStore();

  useEffect(() => {
    void listAssignmentTypes({ page: 1, page_size: 100, search: search.trim() || undefined, sort_by: "code", sort_order: "asc" }).catch(() => toast.error("Không thể tải loại bài tập"));
  }, [listAssignmentTypes, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const openEdit = (item: AssignmentType) => {
    setEditing(item);
    setForm({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      is_auto_gradable: item.is_auto_gradable,
      requires_file_submission: item.requires_file_submission,
      allow_text_submission: item.allow_text_submission,
      allow_file_submission: item.allow_file_submission,
      status: item.status,
    });
    setFormOpen(true);
  };

  const openDelete = (item: AssignmentType) => {
    setDeleting(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Vui lòng nhập mã và tên loại bài tập");
      return;
    }
    try {
      const payload = {
        ...form,
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
      };
      if (editing) {
        await updateAssignmentType(editing.id, payload);
        toast.success("Cập nhật loại bài tập thành công");
      } else {
        await createAssignmentType(payload);
        toast.success("Tạo loại bài tập thành công");
      }
      setFormOpen(false);
      setEditing(null);
      setForm(defaultForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu loại bài tập thất bại");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteAssignmentType(deleting.id);
      toast.success("Xóa loại bài tập thành công");
      setDeleteOpen(false);
      setDeleting(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa loại bài tập thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý loại bài tập"
        description="Cấu hình assignment_types dùng khi tạo bài tập cho lớp học"
        actions={<Button type="button" onClick={openCreate}>Thêm loại bài tập</Button>}
      />

      <div className="mb-4 max-w-sm">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo mã hoặc tên" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Cấu hình</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow>
            ) : assignmentTypes.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Chưa có loại bài tập</TableCell></TableRow>
            ) : assignmentTypes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-gray-900">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="max-w-xs truncate text-gray-500">{item.description ?? "-"}</TableCell>
                <TableCell className="space-x-1">
                  {item.is_auto_gradable ? <Badge className="bg-blue-50 text-blue-600">auto</Badge> : null}
                  {item.requires_file_submission ? <Badge className="bg-orange-50 text-orange-600">required file</Badge> : null}
                  {item.allow_text_submission ? <Badge className="bg-emerald-50 text-emerald-600">text</Badge> : null}
                  {item.allow_file_submission ? <Badge className="bg-amber-50 text-amber-600">file</Badge> : null}
                </TableCell>
                <TableCell>
                  <Badge className={item.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)}>Sửa</Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => openDelete(item)}>Xóa</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Cập nhật loại bài tập" : "Thêm loại bài tập"}</DialogTitle>
            <DialogDescription>Nhập thông tin loại bài tập và cấu hình cách học viên nộp bài.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">Mã<Input value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} placeholder="quiz" /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Tên<Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Quiz" /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">Mô tả<Textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} /></label>
            <label className="space-y-2 text-sm font-medium text-gray-700">Trạng thái<Select value={form.status} onValueChange={(status) => setForm((prev) => ({ ...prev, status }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">active</SelectItem><SelectItem value="inactive">inactive</SelectItem></SelectContent></Select></label>
            <div className="grid gap-2 md:col-span-2 md:grid-cols-2">
              {booleanFields.map(([key, label]) => (
                <label key={key} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {label}
                  <input type="checkbox" checked={Boolean(form[key])} onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button>
            <Button type="button" onClick={() => void handleSubmit()}>{editing ? "Lưu thay đổi" : "Thêm mới"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa loại bài tập</DialogTitle>
            <DialogDescription>Bạn có chắc muốn xóa “{deleting?.name}”? Thao tác này có thể ảnh hưởng đến bài tập đang dùng loại này.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Hủy</Button>
            <Button type="button" variant="destructive" onClick={() => void handleDelete()}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
