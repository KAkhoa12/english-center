import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Student, StudentCreateRequest, StudentUpdateRequest } from "@/services/students/students.type";

type StudentFormProps = {
  initialData?: Student | null;
  loading?: boolean;
  isCreate?: boolean;
  onSubmit: (payload: StudentCreateRequest | StudentUpdateRequest) => Promise<void>;
};

export const StudentForm = ({ initialData, loading = false, isCreate = false, onSubmit }: StudentFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");
  const [learningGoal, setLearningGoal] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setFullName(initialData.user.full_name ?? "");
    setEmail(initialData.user.email ?? "");
    setPhone(initialData.user.phone ?? "");
    setLevel(initialData.level ?? "");
    setLearningGoal(initialData.learning_goal ?? "");
  }, [initialData]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (isCreate) { void onSubmit({ full_name: fullName.trim(), email: email.trim(), phone: phone.trim() || null, password: password || "123456", level: level.trim() || null, learning_goal: learningGoal.trim() || null }); return; } void onSubmit({ level: level.trim() || null, learning_goal: learningGoal.trim() || null }); }} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      {isCreate ? <><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Họ tên" required /><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Điện thoại" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required /></> : <><Input value={fullName} disabled /><Input value={email} disabled /></>}
      <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Trình độ" />
      <Textarea value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)} placeholder="Mục tiêu học tập" rows={4} />
      <div className="flex justify-end"><Button type="submit" disabled={loading}><Save className="h-4 w-4" />Lưu</Button></div>
    </form>
  );
};
