import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CashflowItem } from "@/services/cashflow/cashflow.mock";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

type Props = { data: CashflowItem[]; loading?: boolean; onEdit: (item: CashflowItem) => void };

export const CashflowListTable = ({ data, loading = false, onEdit }: Props) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Noi dung</TableHead>
          <TableHead>Loai</TableHead>
          <TableHead>Ngay giao dich</TableHead>
          <TableHead>So tien</TableHead>
          <TableHead>Ghi chu</TableHead>
          <TableHead className="text-right">Thao tac</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Dang tai du lieu...</TableCell></TableRow>
        ) : data.length === 0 ? (
          <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Khong co du lieu</TableCell></TableRow>
        ) : (
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.type === "income" ? "Thu" : "Chi"}</TableCell>
              <TableCell>{item.transaction_date}</TableCell>
              <TableCell className={item.type === "income" ? "text-emerald-600" : "text-rose-600"}>
                {money.format(item.amount)}
              </TableCell>
              <TableCell>{item.note || "-"}</TableCell>
              <TableCell className="text-right">
                <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Sua</button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
