import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DocumentItem = { object_name?: string; last_modified?: string; size?: number; etag?: string };

type Props = { data: DocumentItem[]; loading?: boolean; onEdit: (item: DocumentItem) => void };

export const DocumentsListTable = ({ data, loading = false, onEdit }: Props) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <Table>
      <TableHeader className="bg-gray-50"><TableRow><TableHead>Ten tep</TableHead><TableHead>Cap nhat</TableHead><TableHead>Kich thuoc</TableHead><TableHead className="text-right">Thao tac</TableHead></TableRow></TableHeader>
      <TableBody>
        {loading ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-gray-500">Dang tai du lieu...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-gray-500">Khong co du lieu</TableCell></TableRow> : data.map((item) => (
          <TableRow key={String(item.object_name)}><TableCell className="font-medium">{item.object_name ?? "-"}</TableCell><TableCell>{item.last_modified ? new Date(item.last_modified).toLocaleString("vi-VN") : "-"}</TableCell><TableCell>{typeof item.size === "number" ? `${Math.ceil(item.size / 1024)} KB` : "-"}</TableCell><TableCell className="text-right"><button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Sua</button></TableCell></TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
