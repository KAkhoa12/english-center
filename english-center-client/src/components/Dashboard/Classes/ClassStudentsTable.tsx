import { DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClassStudentItem } from "@/services/classes/classes.type";
import type { Pagination } from "@/shared/types/response";
import { enrollmentStatusOptions, labelOf } from "./classOptions";

type ClassStudentsTableProps = {
  data: ClassStudentItem[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function ClassStudentsTable({ data, loading = false, pagination, onPageChange, onPageSizeChange }: ClassStudentsTableProps) {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table>
          <TableHeader className="bg-gray-50"><TableRow><TableHead>Học viên</TableHead><TableHead>Email</TableHead><TableHead>Trạng thái ghi danh</TableHead><TableHead>Ngày tham gia</TableHead><TableHead>Điểm cuối</TableHead><TableHead>Ghi chú</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Chưa có học viên trong lớp</TableCell></TableRow> : data.map((item) => (
              <TableRow key={item.student_id}>
                <TableCell className="font-medium">{item.student.full_name}</TableCell>
                <TableCell>{item.student.email}</TableCell>
                <TableCell>{labelOf(enrollmentStatusOptions, item.enrollment_status)}</TableCell>
                <TableCell>{item.enrolled_at ?? "-"}</TableCell>
                <TableCell>{item.final_score ?? "-"}</TableCell>
                <TableCell>{item.note ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </div>
  );
}
