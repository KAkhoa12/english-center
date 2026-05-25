import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Student } from "@/services/students/students.type";
import type { Pagination } from "@/shared/types/response";

type StudentsListTableProps = {
  data: Student[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: Student) => void;
  onDelete: (item: Student) => void;
};

export const StudentsListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit, onDelete }: StudentsListTableProps) => (
  <div><div className="overflow-hidden rounded-2xl border border-gray-100 bg-white"><Table><TableHeader className="bg-gray-50"><TableRow><TableHead>Học viên</TableHead><TableHead>Email</TableHead><TableHead>Điện thoại</TableHead><TableHead>Trình độ</TableHead><TableHead className="w-16 text-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">Chưa có học viên nào</TableCell></TableRow> : data.map((row) => <TableRow key={row.id}><TableCell className="font-medium">{row.user.full_name}</TableCell><TableCell>{row.user.email}</TableCell><TableCell>{row.user.phone ?? "-"}</TableCell><TableCell>{row.level ?? "-"}</TableCell><TableCell className="text-right"><DashboardRowActions onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /></TableCell></TableRow>)}</TableBody></Table></div><DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} /></div>
);
