import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilesStore } from "@/services/files/files.store";
import type { BucketType } from "@/services/files/files.type";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardDocumentCreatePage() {
  const navigate = useNavigate();
  const { uploadFile } = useFilesStore();
  const [bucketType, setBucketType] = useState<BucketType>("material");
  const [folder, setFolder] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Vui long chon tep");
      return;
    }
    try {
      await uploadFile(file, bucketType, folder || undefined);
      toast.success("Tai tai lieu len thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_DOCUMENTS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tai tai lieu that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tai tai lieu moi" description="Tao moi tai lieu" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input value={bucketType} onChange={(e) => setBucketType(e.target.value as BucketType)} placeholder="Bucket type" />
          <Input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Thu muc" />
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="md:col-span-2" />
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button><Button onClick={() => void handleSubmit()}>Luu</Button></div>
      </div>
    </section>
  );
}
