import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Teacher } from "@/services/teachers/teachers.type";
import type { Pagination } from "@/shared/types/response";

type TeachersListTableProps = {
  data: Teacher[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: Teacher) => void;
  onDelete: (item: Teacher) => void;
};

export const TeachersListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit, onDelete }: TeachersListTableProps) => (
  <div><div className="overflow-hidden rounded-2xl border border-gray-100 bg-white"><Table><TableHeader className="bg-gray-50"><TableRow><TableHead>Giáo viên</TableHead><TableHead>Email</TableHead><TableHead>Điện thoại</TableHead><TableHead>Chuyên môn</TableHead><TableHead className="w-16 text-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">Chưa có giáo viên nào</TableCell></TableRow> : data.map((row) => <TableRow key={row.id}><TableCell className="font-medium">{row.user.full_name}</TableCell><TableCell>{row.user.email}</TableCell><TableCell>{row.user.phone ?? "-"}</TableCell><TableCell>{row.specialization ?? "-"}</TableCell><TableCell className="text-right"><DashboardRowActions onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /></TableCell></TableRow>)}</TableBody></Table></div><DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} /></div>
);
