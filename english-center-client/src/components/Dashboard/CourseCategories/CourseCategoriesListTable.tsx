import { Badge } from "@/components/ui/badge";
import { DashboardTablePagination } from "@/components/Dashboard/Comon/DashboardTablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardRowActions } from "@/components/Dashboard/Comon/DashboardRowActions";
import type { Pagination } from "@/shared/types/response";
import type { CourseCategory } from "@/services/coursesCategory/coursesCategory.type";

type CourseCategoriesListTableProps = {
  data: CourseCategory[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const CourseCategoriesListTable = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
}: CourseCategoriesListTableProps) => {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Tên loại khóa học</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-16 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                Chưa có loại khóa học nào
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.description ?? "-"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      row.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
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
