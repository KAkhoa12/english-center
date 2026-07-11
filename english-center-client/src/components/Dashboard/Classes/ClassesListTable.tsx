import { DashboardRowActions, DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClassItem } from "@/services/classes/classes.type";
import type { Pagination } from "@/shared/types/response";
import { classStatusOptions, classTypeOptions, labelOf } from "./classOptions";

type Props = {
  data: ClassItem[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: ClassItem) => void;
};

export const ClassesListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit }: Props) => (
  <div>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Tên lớp</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Giáo viên</TableHead>
            <TableHead>Loại lớp</TableHead>
            <TableHead>Sĩ số</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={7} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell></TableRow>
          ) : data.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="py-8 text-center text-gray-500">Không có dữ liệu</TableCell></TableRow>
          ) : data.map((item) => (
            <TableRow key={item.id} className="cursor-pointer" onClick={() => onEdit(item)}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.course?.name ?? "-"}</TableCell>
              <TableCell>{item.teacher?.full_name ?? "-"}</TableCell>
              <TableCell>{labelOf(classTypeOptions, item.class_type)}</TableCell>
              <TableCell>{item.current_students_count}/{item.max_students}</TableCell>
              <TableCell>{labelOf(classStatusOptions, item.status)}</TableCell>
              <TableCell className="text-right">
                <div onClick={(event) => event.stopPropagation()} className="flex justify-end">
                  <DashboardRowActions onEdit={() => onEdit(item)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </div>
);
