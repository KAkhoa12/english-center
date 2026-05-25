import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Teacher, TeacherCreateRequest, TeacherUpdateRequest } from "@/services/teachers/teachers.type";

type TeacherFormProps = {
  initialData?: Teacher | null;
  loading?: boolean;
  isCreate?: boolean;
  onSubmit: (payload: TeacherCreateRequest | TeacherUpdateRequest) => Promise<void>;
};

export const TeacherForm = ({ initialData, loading = false, isCreate = false, onSubmit }: TeacherFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setFullName(initialData.user.full_name ?? "");
    setEmail(initialData.user.email ?? "");
    setPhone(initialData.user.phone ?? "");
    setSpecialization(initialData.specialization ?? "");
    setBio(initialData.bio ?? "");
  }, [initialData]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (isCreate) { void onSubmit({ full_name: fullName.trim(), email: email.trim(), phone: phone.trim() || null, password: password || "123456", specialization: specialization.trim() || null, bio: bio.trim() || null }); return; } void onSubmit({ specialization: specialization.trim() || null, bio: bio.trim() || null }); }} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      {isCreate ? <><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Họ tên" required /><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Điện thoại" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required /></> : <><Input value={fullName} disabled /><Input value={email} disabled /></>}
      <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Chuyên môn" />
      <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Giới thiệu" rows={4} />
      <div className="flex justify-end"><Button type="submit" disabled={loading}><Save className="h-4 w-4" />Lưu</Button></div>
    </form>
  );
};
