import { DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order } from "@/services/orders/orders.type";
import type { Pagination } from "@/shared/types/response";

type Props = {
  data: Order[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: Order) => void;
};

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const InvoicesListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onEdit }: Props) => (
  <div>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50"><TableRow><TableHead>Ma hoa don</TableHead><TableHead>Ma don</TableHead><TableHead>Trang thai</TableHead><TableHead>Tong tien</TableHead><TableHead>Thanh toan</TableHead><TableHead className="text-right">Thao tac</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Dang tai du lieu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Khong co du lieu</TableCell></TableRow> : data.map((item) => (
            <TableRow key={item.id}><TableCell className="font-medium">{item.invoice_number}</TableCell><TableCell>{item.order_code}</TableCell><TableCell>{item.status}</TableCell><TableCell>{money.format(item.total_amount)}</TableCell><TableCell>{item.payment_method ?? "-"}</TableCell><TableCell className="text-right"><button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Sua</button></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <DashboardTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </div>
);
