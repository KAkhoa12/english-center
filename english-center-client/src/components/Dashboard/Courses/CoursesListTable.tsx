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
import type { CourseListItem } from "@/services/courses/courses.type";
import { useNavigate } from "react-router-dom";

const statusClassMap: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-amber-100 text-amber-700",
  archived: "bg-gray-200 text-gray-700",
};

const modeClassMap: Record<string, string> = {
  center: "bg-blue-50 text-blue-700",
  template: "bg-violet-50 text-violet-700",
};

type CoursesListTableProps = {
  data: CourseListItem[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const CoursesListTable = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
}: CoursesListTableProps) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Mã khóa học</TableHead>
            <TableHead>Tên khóa học</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trình độ</TableHead>
            <TableHead className="text-right">Học phí</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-16 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                Chưa có khóa học nào
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/courses/${row.id}/edit`)}>
                <TableCell className="font-medium text-gray-900">{row.code}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge className={modeClassMap[row.mode] ?? "bg-gray-100 text-gray-600"}>
                    {row.mode === "center" ? "Trung tâm" : "Template"}
                  </Badge>
                </TableCell>
                <TableCell>{row.category?.name ?? row.categories?.[0]?.name ?? "-"}</TableCell>
                <TableCell>{row.target_level ?? "-"}</TableCell>
                <TableCell className="text-right">{row.price.toLocaleString("vi-VN")} đ</TableCell>
                <TableCell>
                  <Badge className={statusClassMap[row.status] ?? "bg-blue-100 text-blue-700"}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DashboardRowActions
                    onEdit={() => navigate(`/dashboard/courses/${row.id}/edit`)}
                  />
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
