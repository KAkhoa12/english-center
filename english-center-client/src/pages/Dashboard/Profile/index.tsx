import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStore } from "@/services/profile/profile.store";
import type { ProfileUpdateRequest } from "@/services/profile/profile.type";

const studentLevels = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"];
const genders = ["male", "female", "other"];

const textValue = (value?: string | null) => value ?? "";

export default function DashboardProfilePage() {
  const { profile, isLoading, getMyProfile, updateMyProfile, updateMyAvatar } = useProfileStore();
  const [form, setForm] = useState<ProfileUpdateRequest>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    void getMyProfile().catch((error) => toast.error(error instanceof Error ? error.message : "Không thể tải hồ sơ"));
  }, [getMyProfile]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.user.full_name,
      phone: profile.user.phone,
      date_of_birth: profile.student?.date_of_birth ?? null,
      gender: profile.student?.gender ?? null,
      address: profile.student?.address ?? null,
      level: profile.student?.level ?? null,
      learning_goal: profile.student?.learning_goal ?? null,
      parent_name: profile.student?.parent_name ?? null,
      parent_phone: profile.student?.parent_phone ?? null,
      specialization: profile.teacher?.specialization ?? null,
      bio: profile.teacher?.bio ?? null,
      experience_years: profile.teacher?.experience_years ?? 0,
      hourly_rate: profile.teacher?.hourly_rate ?? null,
    });
  }, [profile]);

  const patchForm = (patch: ProfileUpdateRequest) => setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = async () => {
    try {
      await updateMyProfile({
        ...form,
        full_name: textValue(form.full_name).trim(),
        phone: textValue(form.phone).trim() || null,
      });
      toast.success("Đã cập nhật thông tin cá nhân");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật thông tin cá nhân thất bại");
    }
  };

  const handleAvatar = async () => {
    if (!avatarFile) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }
    try {
      await updateMyAvatar(avatarFile);
      setAvatarFile(null);
      toast.success("Đã cập nhật ảnh đại diện");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật ảnh đại diện thất bại");
    }
  };

  const user = profile?.user;
  const roles = profile?.roles ?? [];

  return (
    <section>
      <DashboardListPageHeader title="Thông tin cá nhân" description="Cập nhật hồ sơ tài khoản đang đăng nhập" />

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Tài khoản">
          <div className="flex flex-col items-center text-center">
            {user?.avatar_presigned_url ? (
              <img src={user.avatar_presigned_url} alt={user.full_name} className="h-24 w-24 rounded-3xl object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
                <UserRound className="h-10 w-10" />
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-gray-950">{user?.full_name ?? "Tài khoản"}</h2>
            <p className="mt-1 text-sm text-gray-500">{user?.email ?? "Chưa có email"}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {roles.length ? roles.map((role) => (
                <Badge key={role} variant="outline" className="border-brand-100 bg-brand-50 text-brand-700">{role}</Badge>
              )) : <Badge variant="outline">Chưa có vai trò</Badge>}
            </div>
            <div className="mt-5 w-full space-y-3 text-left">
              <label className="space-y-2 text-sm font-medium text-gray-700">Ảnh đại diện<Input type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} /></label>
              <Button type="button" className="w-full" variant="outline" disabled={isLoading} onClick={() => void handleAvatar()}>Cập nhật ảnh</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Chi tiết">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">Họ tên<Input value={textValue(form.full_name)} onChange={(event) => patchForm({ full_name: event.target.value })} /></label>
              <label className="space-y-2 text-sm font-medium text-gray-700">Số điện thoại<Input value={textValue(form.phone)} onChange={(event) => patchForm({ phone: event.target.value })} /></label>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400"><Mail className="h-4 w-4" />Email</p>
                <p className="font-semibold text-gray-900">{user?.email ?? "-"}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400"><ShieldCheck className="h-4 w-4" />Vai trò</p>
                <p className="font-semibold text-gray-900">{roles.length ? roles.join(", ") : "-"}</p>
              </div>
            </div>

            {profile?.student ? (
              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-950">Thông tin học viên</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-gray-700">Ngày sinh<Input type="date" value={textValue(form.date_of_birth)} onChange={(event) => patchForm({ date_of_birth: event.target.value || null })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">Giới tính<Select value={form.gender ?? "none"} onValueChange={(gender) => patchForm({ gender: gender === "none" ? null : gender })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Chưa chọn</SelectItem>{genders.map((gender) => <SelectItem key={gender} value={gender}>{gender}</SelectItem>)}</SelectContent></Select></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">Trình độ<Select value={form.level ?? "none"} onValueChange={(level) => patchForm({ level: level === "none" ? null : level })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Chưa chọn</SelectItem>{studentLevels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">Phụ huynh<Input value={textValue(form.parent_name)} onChange={(event) => patchForm({ parent_name: event.target.value })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">SĐT phụ huynh<Input value={textValue(form.parent_phone)} onChange={(event) => patchForm({ parent_phone: event.target.value })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">Địa chỉ<Textarea value={textValue(form.address)} onChange={(event) => patchForm({ address: event.target.value })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">Mục tiêu học tập<Textarea value={textValue(form.learning_goal)} onChange={(event) => patchForm({ learning_goal: event.target.value })} /></label>
                </div>
              </div>
            ) : null}

            {profile?.teacher ? (
              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-950">Thông tin giảng viên</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-gray-700">Chuyên môn<Input value={textValue(form.specialization)} onChange={(event) => patchForm({ specialization: event.target.value })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">Số năm kinh nghiệm<Input type="number" min={0} value={form.experience_years ?? 0} onChange={(event) => patchForm({ experience_years: Number(event.target.value || 0) })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700">Mức phí/giờ<Input type="number" min={0} value={form.hourly_rate ?? ""} onChange={(event) => patchForm({ hourly_rate: event.target.value ? Number(event.target.value) : null })} /></label>
                  <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">Giới thiệu<Textarea value={textValue(form.bio)} onChange={(event) => patchForm({ bio: event.target.value })} /></label>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end">
              <Button type="button" disabled={isLoading} onClick={() => void handleSubmit()}>Lưu hồ sơ</Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}

