import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Staff, StaffCreateRequest, StaffUpdateRequest } from "@/services/staff/staff.type";

type StaffFormProps = {
  initialData?: Staff | null;
  loading?: boolean;
  isCreate?: boolean;
  onSubmit: (payload: StaffCreateRequest | StaffUpdateRequest) => Promise<void>;
};

export const StaffForm = ({ initialData, loading = false, isCreate = false, onSubmit }: StaffFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setFullName(initialData.user.full_name ?? "");
    setEmail(initialData.user.email ?? "");
    setPhone(initialData.user.phone ?? "");
    setPosition(initialData.position ?? "");
    setDepartment(initialData.department ?? "");
    setNote(initialData.note ?? "");
  }, [initialData]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (isCreate) { void onSubmit({ full_name: fullName.trim(), email: email.trim(), phone: phone.trim() || null, password: password || "123456", position: position.trim() || null, department: department.trim() || null, note: note.trim() || null }); return; } void onSubmit({ position: position.trim() || null, department: department.trim() || null, note: note.trim() || null }); }} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      {isCreate ? <><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Họ tên" required /><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Điện thoại" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required /></> : <><Input value={fullName} disabled placeholder="Họ tên" /><Input value={email} disabled placeholder="Email" /></>}
      <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Chức vụ" />
      <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Phòng ban" />
      <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú" rows={4} />
      <div className="flex justify-end"><Button type="submit" disabled={loading}><Save className="h-4 w-4" />Lưu</Button></div>
    </form>
  );
};
