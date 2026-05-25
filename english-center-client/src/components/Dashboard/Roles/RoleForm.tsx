import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Role, RoleCreateRequest, RoleUpdateRequest } from "@/services/roles/roles.type";

type RoleFormProps = {
  initialData?: Role | null;
  loading?: boolean;
  onSubmit: (payload: RoleCreateRequest | RoleUpdateRequest) => Promise<void>;
};

export const RoleForm = ({ initialData, loading = false, onSubmit }: RoleFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? "");
    setDescription(initialData.description ?? "");
  }, [initialData]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); void onSubmit({ name: name.trim(), description: description.trim() || null }); }} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên vai trò" required />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả" rows={4} />
      <div className="flex justify-end"><Button type="submit" disabled={loading}><Save className="h-4 w-4" />Lưu</Button></div>
    </form>
  );
};
