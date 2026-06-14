import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClassSession } from "@/services/classSessions/classSessions.type";
import type { Pagination } from "@/shared/types/response";
import { labelOf, sessionModeOptions, sessionStatusOptions } from "./classOptions";

type ClassSessionsTableProps = {
  data: ClassSession[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: ClassSession) => void;
  onDelete: (item: ClassSession) => void;
};

export function ClassSessionsTable({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit, onDelete }: ClassSessionsTableProps) {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table>
          <TableHeader className="bg-gray-50"><TableRow><TableHead>Tiêu đề</TableHead><TableHead>Ngày</TableHead><TableHead>Giờ</TableHead><TableHead>Giáo viên</TableHead><TableHead>Phòng</TableHead><TableHead>Hình thức</TableHead><TableHead>Trạng thái</TableHead><TableHead className="w-16 text-right">Thao tác</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">Chưa có lịch học nào</TableCell></TableRow> : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.session_date}</TableCell>
                <TableCell>{item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}</TableCell>
                <TableCell>{item.teacher?.full_name ?? "-"}</TableCell>
                <TableCell>{item.room?.name ?? "-"}</TableCell>
                <TableCell>{labelOf(sessionModeOptions, item.mode)}</TableCell>
                <TableCell>{labelOf(sessionStatusOptions, item.status)}</TableCell>
                <TableCell className="text-right"><DashboardRowActions onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </div>
  );
}
