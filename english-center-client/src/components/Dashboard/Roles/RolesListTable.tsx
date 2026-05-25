import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Role } from "@/services/roles/roles.type";
import type { Pagination } from "@/shared/types/response";

type RolesListTableProps = {
  data: Role[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: Role) => void;
  onDelete: (item: Role) => void;
};

export const RolesListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit, onDelete }: RolesListTableProps) => (
  <div>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50"><TableRow><TableHead>Tên vai trò</TableHead><TableHead>Mô tả</TableHead><TableHead className="w-16 text-right">Thao tác</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={3} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={3} className="py-8 text-center text-gray-500">Chưa có vai trò nào</TableCell></TableRow> : data.map((row) => (
            <TableRow key={row.id}><TableCell className="font-medium">{row.name}</TableCell><TableCell>{row.description ?? "-"}</TableCell><TableCell className="text-right"><DashboardRowActions onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </div>
);
