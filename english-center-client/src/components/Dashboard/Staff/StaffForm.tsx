import { Save, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Staff, StaffCreateRequest, StaffUpdateRequest } from "@/services/staff/staff.type";

type StaffFormProps = {
  initialData?: Staff | null;
  loading?: boolean;
  isCreate?: boolean;
  onSubmit: (payload: StaffCreateRequest | StaffUpdateRequest, avatarFile?: File | null) => Promise<void>;
};

const FieldLabel = ({ children }: { children: string }) => <label className="text-sm font-medium text-gray-700">{children}</label>;

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1.5">
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const getInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NV";
  return parts.slice(-2).map((part) => part[0]?.toUpperCase()).join("");
};

const isUrl = (value?: string | null) => Boolean(value && /^https?:\/\//.test(value));

export const StaffForm = ({ initialData, loading = false, isCreate = false, onSubmit }: StaffFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
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

  const avatarPreview = useMemo(() => avatarFile ? URL.createObjectURL(avatarFile) : null, [avatarFile]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const currentAvatar = isUrl(initialData?.user.avatar_url) ? initialData?.user.avatar_url : null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCreate) {
      void onSubmit({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        password: password || "123456",
        position: position.trim() || null,
        department: department.trim() || null,
        note: note.trim() || null,
      }, avatarFile);
      return;
    }

    void onSubmit({
      position: position.trim() || null,
      department: department.trim() || null,
      note: note.trim() || null,
    }, avatarFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Ảnh đại diện</p>
          <p className="mt-1 text-xs text-gray-500">Ảnh tài khoản giúp nhận diện nhân sự trong hệ thống.</p>
          <div className="mt-4 flex flex-col items-center gap-3">
            {avatarPreview || currentAvatar ? (
              <img src={avatarPreview || currentAvatar || ""} alt="Avatar nhân viên" className="h-28 w-28 rounded-2xl object-cover ring-1 ring-gray-200" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-700 ring-1 ring-emerald-100">
                {getInitials(fullName)}
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              {avatarFile ? avatarFile.name : "Chọn ảnh"}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} />
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-100 p-4">
            <h3 className="text-base font-semibold text-gray-900">Thông tin tài khoản</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Họ tên">
                <Input value={fullName} onChange={(event) => setFullName(event.target.value)} disabled={!isCreate} required />
              </Field>
              <Field label="Email">
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!isCreate} required />
              </Field>
              <Field label="Điện thoại">
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} disabled={!isCreate} />
              </Field>
              {isCreate ? (
                <Field label="Mật khẩu">
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mặc định 123456 nếu bỏ trống" />
                </Field>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 p-4">
            <h3 className="text-base font-semibold text-gray-900">Thông tin nhân viên</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Chức vụ">
                <Input value={position} onChange={(event) => setPosition(event.target.value)} placeholder="VD: Tư vấn tuyển sinh" />
              </Field>
              <Field label="Phòng ban">
                <Input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="VD: Academic, Sales" />
              </Field>
              <div className="space-y-1.5 md:col-span-2">
                <FieldLabel>Ghi chú</FieldLabel>
                <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú nội bộ" rows={5} />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4" />
          Lưu
        </Button>
      </div>
    </form>
  );
};
