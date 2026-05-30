import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { DocumentsListTable } from "@/components/Dashboard/Documents/DocumentsListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilesStore } from "@/services/files/files.store";
import type { BucketType } from "@/services/files/files.type";

const bucketOptions: Array<{ value: BucketType; label: string; description: string }> = [
  { value: "material", label: "Tài liệu học tập", description: "PDF, tài liệu bài học, file đính kèm" },
  { value: "video", label: "Video", description: "Video bài học hoặc video giới thiệu" },
  { value: "avatar", label: "Ảnh/thumbnail", description: "Ảnh đại diện, thumbnail khóa học" },
  { value: "submission", label: "Bài nộp", description: "File học viên nộp" },
  { value: "export", label: "Export", description: "File xuất báo cáo" },
];

type DocumentItem = { object_name?: string; last_modified?: string; size?: number; etag?: string };

export default function DashboardDocumentsPage() {
  const [bucketType, setBucketType] = useState<BucketType>("material");
  const [prefix, setPrefix] = useState("");
  const [folder, setFolder] = useState("");
  const [imagesOnly, setImagesOnly] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { bucketObjects, isLoading, listBucketObjects, uploadFile, getPresignedUrl, deleteFile } = useFilesStore();

  const loadObjects = () => {
    void listBucketObjects(bucketType, { prefix: prefix || undefined, images_only: imagesOnly }).catch(() =>
      toast.error("Không thể tải danh sách tài liệu"),
    );
  };

  useEffect(() => {
    loadObjects();
  }, [bucketType, imagesOnly]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn tệp cần tải lên");
      return;
    }
    try {
      await uploadFile(file, bucketType, folder.trim() || undefined);
      setFile(null);
      toast.success("Tải tài liệu lên thành công");
      loadObjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tải tài liệu thất bại");
    }
  };

  const handleView = async (item: DocumentItem) => {
    if (!item.object_name) return;
    try {
      const result = await getPresignedUrl(bucketType, item.object_name);
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Không thể tạo link xem tài liệu");
    }
  };

  const handleDelete = async (item: DocumentItem) => {
    if (!item.object_name) return;
    try {
      await deleteFile(bucketType, item.object_name);
      toast.success("Đã xóa tài liệu");
      loadObjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa tài liệu thất bại");
    }
  };

  const selectedBucket = bucketOptions.find((item) => item.value === bucketType);

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý tài nguyên"
        description="Quản lý file trên Minio thông qua files store: upload, xem link tạm thời và xóa object"
      />

      <div className="mb-5 grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Bucket tài nguyên</h3>
          <Select value={bucketType} onValueChange={(value: BucketType) => setBucketType(value)}>
            <SelectTrigger className="mt-4 w-full">
              <SelectValue placeholder="Chọn bucket" />
            </SelectTrigger>
            <SelectContent>
              {bucketOptions.map((bucket) => (
                <SelectItem key={bucket.value} value={bucket.value}>
                  {bucket.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm leading-relaxed text-gray-500">
            {selectedBucket?.description}
          </p>
          <label className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-700">
            Chỉ hiển thị ảnh
            <input
              type="checkbox"
              checked={imagesOnly}
              onChange={(event) => setImagesOnly(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Tải tệp mới</h3>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
            <Input value={folder} onChange={(event) => setFolder(event.target.value)} placeholder="Thư mục, ví dụ: courses/ielts" />
            <Input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <Button type="button" disabled={isLoading} onClick={() => void handleUpload()}>
              <UploadCloud className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={prefix} onChange={(event) => setPrefix(event.target.value)} placeholder="Lọc theo prefix/object path" className="max-w-md" />
        <Button type="button" variant="outline" onClick={loadObjects}>
          Lọc tài liệu
        </Button>
      </div>

      <DocumentsListTable
        data={(bucketObjects?.items as DocumentItem[]) ?? []}
        loading={isLoading}
        onView={(item) => void handleView(item)}
        onDelete={(item) => void handleDelete(item)}
      />
    </section>
  );
}
