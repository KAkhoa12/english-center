import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Permission, PermissionCreateRequest, PermissionUpdateRequest } from "@/services/permissions/permissions.type";

type PermissionFormProps = {
  initialData?: Permission | null;
  loading?: boolean;
  onSubmit: (payload: PermissionCreateRequest | PermissionUpdateRequest) => Promise<void>;
};

export const PermissionForm = ({ initialData, loading = false, onSubmit }: PermissionFormProps) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setCode(initialData.code ?? "");
    setName(initialData.name ?? "");
    setDescription(initialData.description ?? "");
  }, [initialData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({ code: code.trim(), name: name.trim() || null, description: description.trim() || null });
      }}
      className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5"
    >
      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã quyền" required />
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên quyền" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả" rows={4} />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4" />
          Lưu
        </Button>
      </div>
    </form>
  );
};
