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
type CourseTag = { id: string; name: string; slug: string; updated_at: string; };

type CourseTagsListTableProps = {
  data: CourseTag[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const CourseTagsListTable = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
}: CourseTagsListTableProps) => {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Tên tag</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Cập nhật</TableHead>
            <TableHead className="w-16 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                Chưa có tag khóa học nào
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{new Date(row.updated_at).toLocaleDateString("vi-VN")}</TableCell>
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
