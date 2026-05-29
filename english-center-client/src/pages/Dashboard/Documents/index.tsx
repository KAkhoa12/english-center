import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { DocumentsListTable } from "@/components/Dashboard/Documents/DocumentsListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilesStore } from "@/services/files/files.store";
import type { BucketType } from "@/services/files/files.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardDocumentsPage() {
  const navigate = useNavigate();
  const [bucketType, setBucketType] = useState<BucketType>("material");
  const [prefix, setPrefix] = useState("");
  const { bucketObjects, isLoading, listBucketObjects } = useFilesStore();

  useEffect(() => {
    void listBucketObjects(bucketType, { prefix: prefix || undefined }).catch(() => toast.error("Khong the tai danh sach tai lieu"));
  }, [bucketType, prefix, listBucketObjects]);

  return (
    <section>
      <DashboardListPageHeader title="Quan ly tai lieu" description="Quan ly tep tai lieu trong he thong" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={bucketType} onChange={(e) => setBucketType(e.target.value as BucketType)} placeholder="Bucket type" className="max-w-xs" />
        <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix" className="max-w-sm" />
        <Button variant="outline" onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_DOCUMENTS_CREATE)}>Them moi</Button>
      </div>
      <DocumentsListTable data={(bucketObjects?.items as Array<Record<string, unknown>>) ?? []} loading={isLoading} onEdit={(item) => navigate(PRIVATE_ROUTES.DASHBOARD_DOCUMENTS_EDIT.replace(":documentId", encodeURIComponent(String(item.object_name ?? ""))))} />
    </section>
  );
}
