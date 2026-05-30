import { ExternalLink, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DocumentItem = {
  object_name?: string;
  last_modified?: string;
  size?: number;
  etag?: string;
};

type Props = {
  data: DocumentItem[];
  loading?: boolean;
  onView: (item: DocumentItem) => void;
  onDelete: (item: DocumentItem) => void;
};

export const DocumentsListTable = ({ data, loading = false, onView, onDelete }: Props) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Tên object</TableHead>
          <TableHead>Cập nhật</TableHead>
          <TableHead>Kích thước</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="py-8 text-center text-gray-500">Không có tài liệu trong bucket này</TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow key={String(item.object_name)}>
              <TableCell className="max-w-[420px] truncate font-medium text-gray-900">{item.object_name ?? "-"}</TableCell>
              <TableCell>{item.last_modified ? new Date(item.last_modified).toLocaleString("vi-VN") : "-"}</TableCell>
              <TableCell>{typeof item.size === "number" ? `${Math.ceil(item.size / 1024)} KB` : "-"}</TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onView(item)}>
                    <ExternalLink className="h-4 w-4" />
                    Mở
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
