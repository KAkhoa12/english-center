import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilesStore } from "@/services/files/files.store";
import type { BucketType } from "@/services/files/files.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardDocumentEditPage() {
  const { documentId = "" } = useParams();
  const navigate = useNavigate();
  const { deleteFile } = useFilesStore();
  const [bucketType, setBucketType] = useState<BucketType>("material");

  const handleDelete = async () => {
    try {
      await deleteFile(bucketType, decodeURIComponent(documentId));
      toast.success("Da xoa tai lieu");
      navigate(PRIVATE_ROUTES.DASHBOARD_DOCUMENTS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xoa tai lieu that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Chinh sua tai lieu" description="Quan ly tai lieu da tai len" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <Input value={decodeURIComponent(documentId)} readOnly />
        <Input value={bucketType} onChange={(e) => setBucketType(e.target.value as BucketType)} placeholder="Bucket type" />
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button><Button variant="destructive" onClick={() => void handleDelete()}>Xoa tai lieu</Button></div>
      </div>
    </section>
  );
}
