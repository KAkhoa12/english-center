import { DashboardTablePagination } from "@/components/Dashboard/Comon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PaymentPlan } from "@/services/paymentPlans/paymentPlans.type";
import type { Pagination } from "@/shared/types/response";

type Props = {
  data: PaymentPlan[];
  loading?: boolean;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (item: PaymentPlan) => void;
};

export const PaymentPlansListTable = ({ data, loading = false, pagination, onPageChange, onPageSizeChange, onView }: Props) => (
  <div>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Installments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-gray-500">Dang tai du lieu...</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-gray-500">Khong co du lieu</TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.order_id}</TableCell>
                <TableCell>{item.plan_type}</TableCell>
                <TableCell>{item.total_amount.toLocaleString("vi-VN")} VNĐ</TableCell>
                <TableCell>{item.installment_count ?? "-"}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right">
                  <button type="button" onClick={() => onView(item)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Xem</button>
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
