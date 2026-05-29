import { DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClassItem } from "@/services/classes/classes.type";
import type { Pagination } from "@/shared/types/response";

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
        <TableHeader className="bg-gray-50"><TableRow><TableHead>Ten lop</TableHead><TableHead>Khoa hoc</TableHead><TableHead>Giang vien</TableHead><TableHead>Si so</TableHead><TableHead>Trang thai</TableHead><TableHead className="text-right">Thao tac</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Dang tai du lieu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Khong co du lieu</TableCell></TableRow> : data.map((item) => (
            <TableRow key={item.id}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.course?.name ?? "-"}</TableCell><TableCell>{item.teacher?.full_name ?? "-"}</TableCell><TableCell>{item.current_students_count}/{item.max_students}</TableCell><TableCell>{item.status}</TableCell><TableCell className="text-right"><button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Sua</button></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </div>
);
