import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardRowActions } from "@/components/Dashboard/Comon/DashboardRowActions";
import { DashboardTablePagination } from "@/components/Dashboard/Comon/DashboardTablePagination";
import type { Pagination } from "@/shared/types/response";
import type { Role } from "@/services/roles/roles.type";

type RolesListTableProps = {
  data: Role[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const RolesListTable = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
}: RolesListTableProps) => {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Tên vai trò</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-16 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-gray-500">
                  Chưa có vai trò nào
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                  <TableCell>{row.description ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <DashboardRowActions />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
