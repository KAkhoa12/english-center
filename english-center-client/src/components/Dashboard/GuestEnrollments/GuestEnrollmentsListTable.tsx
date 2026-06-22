import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GuestEnrollment } from "@/services/guestEnrollments/guestEnrollments.type";
import type { Pagination } from "@/shared/types/response";

type GuestEnrollmentsListTableProps = {
  data: GuestEnrollment[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: GuestEnrollment) => void;
  onDelete: (item: GuestEnrollment) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const GuestEnrollmentsListTable = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: GuestEnrollmentsListTableProps) => (
  <div>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Nội dung tư vấn</TableHead>
            <TableHead className="w-48">Ngày tạo</TableHead>
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
                Chưa có khách vãng lai nào
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {item.content}
                </TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(item.created_at)}</TableCell>
                <TableCell className="text-right">
                  <DashboardRowActions onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </div>
);
