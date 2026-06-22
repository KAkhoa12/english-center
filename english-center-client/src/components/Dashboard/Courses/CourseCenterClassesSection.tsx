import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardDateInput } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClassCreateRequest, ClassItem } from "@/services/classes/classes.type";
import { generateCode } from "@/shared/helpers/code-format";
import { PRIVATE_ROUTES } from "@/shared/routes";

const emptyClassForm = {
  name: "",
  code: "",
  class_type: "offline",
  max_students: "20",
  start_date: "",
  status: "planned",
};

const classStatusOptions = [
  { value: "planned", label: "Dự kiến" },
  { value: "ongoing", label: "Đang học" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "archived", label: "Lưu trữ" },
];

const classStatusLabel = (status: string) => classStatusOptions.find((item) => item.value === status)?.label ?? status;

const formatDate = (value?: string | null) => {
  if (!value) return "Chưa có ngày";
  return new Date(value).toLocaleDateString("vi-VN");
};

type CourseCenterClassesSectionProps = {
  courseId: string;
  courseName?: string;
  classes: ClassItem[];
  onCreateClass: (payload: ClassCreateRequest) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
};

export const CourseCenterClassesSection = ({
  courseId,
  courseName,
  classes,
  onCreateClass,
  onDeleteClass,
}: CourseCenterClassesSectionProps) => {
  const navigate = useNavigate();
  const [classForm, setClassForm] = useState(emptyClassForm);
  const [classCodeTouched, setClassCodeTouched] = useState(false);

  const handleCreateClass = async () => {
    if (!classForm.name.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }

    try {
      await onCreateClass({
        course_id: courseId,
        name: classForm.name.trim(),
        code: classForm.code.trim() || null,
        class_type: classForm.class_type,
        max_students: Number(classForm.max_students || 1),
        start_date: classForm.start_date || null,
        status: classForm.status,
      });
      setClassForm(emptyClassForm);
      setClassCodeTouched(false);
      toast.success("Thêm lớp học thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm lớp học thất bại");
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await onDeleteClass(classId);
      toast.success("Xóa lớp thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa lớp thất bại");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lớp học của {courseName || "khóa học"}</h3>
          <p className="mt-1 text-sm text-gray-500">Tạo lớp theo ngày khai giảng và quản lý nhanh bằng bảng.</p>
        </div>
        <Badge className="bg-blue-50 text-blue-700">{classes.length} lớp</Badge>
      </div>

      <div className="mt-5 rounded-2xl bg-gray-50 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            Tên lớp
            <Input
              value={classForm.name}
              onChange={(event) => {
                const name = event.target.value;
                setClassForm((prev) => ({ ...prev, name, code: classCodeTouched ? prev.code : generateCode(name) }));
              }}
              placeholder="VD: IELTS Foundation 01"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            Mã lớp
            <Input
              value={classForm.code}
              onChange={(event) => {
                setClassCodeTouched(true);
                setClassForm((prev) => ({ ...prev, code: generateCode(event.target.value) }));
              }}
              placeholder="VD: IELTS_F01"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            Hình thức lớp
            <Select value={classForm.class_type} onValueChange={(value) => setClassForm((prev) => ({ ...prev, class_type: value }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            Sĩ số tối đa
            <Input type="number" min={1} value={classForm.max_students} onChange={(event) => setClassForm((prev) => ({ ...prev, max_students: event.target.value }))} />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            Ngày khai giảng
            <DashboardDateInput value={classForm.start_date} onChange={(start_date) => setClassForm((prev) => ({ ...prev, start_date }))} />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            Trạng thái lớp
            <Select value={classForm.status} onValueChange={(value) => setClassForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {classStatusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <div className="flex items-end md:col-span-2">
            <Button type="button" className="w-full md:w-auto" onClick={() => void handleCreateClass()}>
              <Plus className="h-4 w-4" />
              Thêm lớp
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lớp</TableHead>
              <TableHead>Hình thức</TableHead>
              <TableHead>Sĩ số</TableHead>
              <TableHead>Ngày khai giảng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-gray-500">Chưa có lớp nào cho khóa center này.</TableCell>
              </TableRow>
            ) : classes.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.code || "Chưa có mã"}</p>
                </TableCell>
                <TableCell>{item.class_type}</TableCell>
                <TableCell>{item.current_students_count}/{item.max_students}</TableCell>
                <TableCell>{formatDate(item.start_date)}</TableCell>
                <TableCell><Badge className="bg-blue-50 text-blue-700">{classStatusLabel(item.status)}</Badge></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", item.id))}>
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void handleDeleteClass(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
