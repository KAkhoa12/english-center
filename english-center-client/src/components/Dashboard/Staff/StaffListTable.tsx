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
import type { Staff } from "@/services/staff/staff.type";

type StaffListTableProps = {
  data: Staff[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const StaffListTable = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
}: StaffListTableProps) => {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead className="w-16 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                  Chưa có nhân viên nào
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-gray-900">{row.user.full_name}</TableCell>
                  <TableCell>{row.user.email}</TableCell>
                  <TableCell>{row.user.phone ?? "-"}</TableCell>
                  <TableCell>{row.position ?? "-"}</TableCell>
                  <TableCell>{row.department ?? "-"}</TableCell>
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
