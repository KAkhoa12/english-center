import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Permission } from "@/services/permissions/permissions.type";
import type { Pagination } from "@/shared/types/response";

type PermissionsListTableProps = {
  data: Permission[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: Permission) => void;
  onDelete: (item: Permission) => void;
};

export const PermissionsListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit, onDelete }: PermissionsListTableProps) => (
  <div>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50"><TableRow><TableHead>Mã quyền</TableHead><TableHead>Tên quyền</TableHead><TableHead>Mô tả</TableHead><TableHead className="w-16 text-right">Thao tác</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-gray-500">Chưa có quyền nào</TableCell></TableRow> : data.map((row) => (
            <TableRow key={row.id}><TableCell className="font-medium">{row.code}</TableCell><TableCell>{row.name ?? "-"}</TableCell><TableCell>{row.description ?? "-"}</TableCell><TableCell className="text-right"><DashboardRowActions onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </div>
);
