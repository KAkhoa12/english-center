import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export default function DashboardAssignmentTypesPage() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AssignmentType | null>(null);
  const [form, setForm] = useState(defaultForm);
  const { assignmentTypes, isLoading, listAssignmentTypes, createAssignmentType, updateAssignmentType, deleteAssignmentType } =
    useAssignmentTypesStore();

  useEffect(() => {
    void listAssignmentTypes({ page: 1, page_size: 100, search: search.trim() || undefined, sort_by: "code", sort_order: "asc" }).catch(() =>
      toast.error("Không thể tải loại bài tập"),
    );
  }, [listAssignmentTypes, search]);

  const startEdit = (item: AssignmentType) => {
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
  };

  const resetForm = () => {
    setEditing(null);
    setForm(defaultForm);
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Vui lòng nhập mã và tên loại bài tập");
      return;
    }
    try {
      if (editing) {
        await updateAssignmentType(editing.id, {
          ...form,
          code: form.code.trim(),
          name: form.name.trim(),
          description: form.description.trim() || null,
        });
        toast.success("Cập nhật loại bài tập thành công");
      } else {
        await createAssignmentType({
          ...form,
          code: form.code.trim(),
          name: form.name.trim(),
          description: form.description.trim() || null,
        });
        toast.success("Tạo loại bài tập thành công");
      }
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu loại bài tập thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý loại bài tập"
        description="Cấu hình assignment_types dùng khi tạo bài tập cho lớp học"
      />

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            {editing ? "Cập nhật loại bài tập" : "Thêm loại bài tập"}
          </h3>
          <div className="mt-4 space-y-3">
            <Input value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))} placeholder="code, ví dụ: quiz" />
            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên loại bài tập" />
            <Input
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả"
            />
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
            {[
              ["is_auto_gradable", "Tự động chấm điểm"],
              ["requires_file_submission", "Bắt buộc nộp file"],
              ["allow_text_submission", "Cho phép nộp text"],
              ["allow_file_submission", "Cho phép nộp file"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {label}
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof typeof form])}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
              </label>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              {editing ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              ) : null}
              <Button type="button" onClick={() => void handleSubmit()}>
                {editing ? "Lưu thay đổi" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 max-w-sm">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo mã hoặc tên" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Cấu hình</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell>
                  </TableRow>
                ) : assignmentTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">Chưa có loại bài tập</TableCell>
                  </TableRow>
                ) : (
                  assignmentTypes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-gray-900">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="space-x-1">
                        {item.is_auto_gradable ? <Badge className="bg-blue-50 text-blue-600">auto</Badge> : null}
                        {item.allow_text_submission ? <Badge className="bg-emerald-50 text-emerald-600">text</Badge> : null}
                        {item.allow_file_submission ? <Badge className="bg-amber-50 text-amber-600">file</Badge> : null}
                      </TableCell>
                      <TableCell>
                        <Badge className={item.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => startEdit(item)}>Sửa</Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                await deleteAssignmentType(item.id);
                                toast.success("Xóa loại bài tập thành công");
                              } catch {
                                toast.error("Xóa loại bài tập thất bại");
                              }
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
