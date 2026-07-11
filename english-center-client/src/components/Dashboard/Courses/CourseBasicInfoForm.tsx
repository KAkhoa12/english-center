import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Select } from "@/components/Comon/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CourseDetail, CourseMode, UpdateCourseRequest } from "@/services/courses/courses.type";
import type { CourseCategory } from "@/services/coursesCategory/coursesCategory.type";

type CourseBasicInfoFormProps = {
  course: CourseDetail | null;
  categories: CourseCategory[];
  loading?: boolean;
  formId?: string;
  onSubmit: (payload: UpdateCourseRequest) => Promise<void>;
};

export default function CourseBasicInfoForm({
  course,
  categories,
  loading = false,
  formId,
  onSubmit,
}: CourseBasicInfoFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mode, setMode] = useState<CourseMode>("center");
  const [targetLevel, setTargetLevel] = useState("");
  const [totalSessions, setTotalSessions] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [outputGoal, setOutputGoal] = useState("");

  useEffect(() => {
    if (!course) return;
    setName(course.name ?? "");
    setCode(course.code ?? "");
    setSlug(course.slug ?? "");
    setCategoryId(course.category_id ?? course.category?.id ?? "");
    setMode(course.mode ?? "center");
    setTargetLevel(course.target_level ?? "");
    setTotalSessions(
      course.total_sessions === null || course.total_sessions === undefined
        ? ""
        : String(course.total_sessions),
    );
    setPrice(String(course.price ?? 0));
    setStatus(course.status ?? "active");
    setDescription(course.description ?? "");
    setOutputGoal(course.output_goal ?? "");
  }, [course]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name: name.trim(),
      code: code.trim(),
      slug: slug.trim() || null,
      category_id: categoryId || null,
      mode,
      target_level: targetLevel.trim() || null,
      total_sessions: totalSessions.trim() ? Number(totalSessions) : null,
      price: price.trim() ? Number(price) : null,
      status,
      description: description.trim() || null,
      output_goal: outputGoal.trim() || null,
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tên khóa học</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Mã khóa học</label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Loại khóa học</label>
          <Select
            value={
              categoryId
                ? { key: categories.find((category) => category.id === categoryId)?.name ?? categoryId, value: categoryId }
                : null
            }
            onChange={(option) => setCategoryId(option?.value ?? "")}
            options={categories.map((category) => ({ key: category.name, value: category.id }))}
            placeholder="Chọn loại khóa học"
            is_search
            searchPlaceholder="Tìm loại khóa học..."
            emptyText="Không có loại khóa học"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Mode khóa học</label>
          <Select
            value={
              mode === "center"
                ? { key: "Center - bán theo lớp học", value: "center" }
                : { key: "Template - module/bài học", value: "template" }
            }
            onChange={(option) => setMode((option?.value as CourseMode) ?? "center")}
            options={[
              { key: "Center - bán theo lớp học", value: "center" },
              { key: "Template - module/bài học", value: "template" },
            ]}
            placeholder="Mode khóa học"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Trình độ mục tiêu</label>
          <Select
            value={targetLevel ? { key: targetLevel, value: targetLevel } : null}
            onChange={(option) => setTargetLevel(option?.value ?? "")}
            options={["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => ({ key: level, value: level }))}
            placeholder="Chọn trình độ"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tổng số buổi</label>
          <Input
            type="number"
            min={0}
            value={totalSessions}
            onChange={(e) => setTotalSessions(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Học phí</label>
          <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Trạng thái</label>
          <Select
            value={
              status === "inactive"
                ? { key: "inactive", value: "inactive" }
                : status === "archived"
                  ? { key: "archived", value: "archived" }
                  : { key: "active", value: "active" }
            }
            onChange={(option) => setStatus(option?.value ?? "active")}
            options={[
              { key: "active", value: "active" },
              { key: "inactive", value: "inactive" },
              { key: "archived", value: "archived" },
            ]}
            placeholder="Trạng thái"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Mô tả khóa học</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Mục tiêu đầu ra</label>
          <Textarea value={outputGoal} onChange={(e) => setOutputGoal(e.target.value)} rows={3} />
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="submit" disabled={loading} className="bg-brand-500 text-white hover:bg-brand-600">
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
