import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardCourseThumbnailField, DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { MultiSelectBadge } from "@/components/MultiSelectBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { useCoursesTagStore } from "@/services/coursesTag/coursesTag.store";
import { format_code, format_slug } from "@/shared/helpers/slug_format";
import { PRIVATE_ROUTES } from "@/shared/routes";

export const DashboardCourseCreatePage = () => {
  const navigate = useNavigate();
  const { createCourse, uploadCourseThumbnail, isLoading } = useCoursesStore();
  const { categories, listCategories } = useCoursesCategoryStore();
  const { tags, listTags } = useCoursesTagStore();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"center" | "template">("center");
  const [targetLevel, setTargetLevel] = useState("A1");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [totalSessions, setTotalSessions] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [outputGoal, setOutputGoal] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    void listCategories({ page: 1, page_size: 100, status: "active", sort_by: "name", sort_order: "asc" });
    void listTags({ page: 1, page_size: 100, sort_by: "name", sort_order: "asc" });
  }, [listCategories, listTags]);

  const handleNameChange = (value: string) => {
    setName(value);

    if (!slugEdited) {
      setSlug(format_slug(value));
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !categoryId) {
      toast.error("Vui lòng nhập tên và loại khóa học");
      return;
    }

    const trimmedName = name.trim();
    const normalizedSlug = slug.trim() || format_slug(trimmedName);

    try {
      const created = await createCourse({
        name: trimmedName,
        code: format_code(trimmedName),
        slug: normalizedSlug || null,
        category_id: categoryId,
        mode,
        target_level: targetLevel || null,
        duration_weeks: durationWeeks.trim() ? Number(durationWeeks) : null,
        total_sessions: totalSessions.trim() ? Number(totalSessions) : null,
        price: price.trim() ? Number(price) : 0,
        status,
        tag_ids: selectedTagIds.length ? selectedTagIds : null,
        description: description.trim() || null,
        output_goal: outputGoal.trim() || null,
      });

      if (thumbnailFile) {
        await uploadCourseThumbnail(created.id, thumbnailFile);
      }

      toast.success("Tạo khóa học thành công");
      navigate(PRIVATE_ROUTES.DASHBOARD_COURSES_EDIT.replace(":courseId", created.id));
    } catch {
      toast.error("Tạo khóa học thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Tạo mới khóa học"
        description="Nhập thông tin cơ bản và ảnh đại diện cho khóa học"
      />

      <div className="space-y-5">
        <DashboardCourseThumbnailField
          file={thumbnailFile}
          onFileChange={setThumbnailFile}
          disabled={isLoading}
        />

        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tên khóa học</label>
              <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Tên khóa học" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setSlug(format_slug(e.target.value));
                }}
                placeholder="slug-khoa-hoc"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Loại khóa học</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loại khóa học" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Mode khóa học</label>
              <Select value={mode} onValueChange={(value: "center" | "template") => setMode(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mode khóa học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center - bán theo lớp học</SelectItem>
                  <SelectItem value="template">Template - học theo module/bài học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Trình độ mục tiêu</label>
              <Select value={targetLevel} onValueChange={setTargetLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Trình độ mục tiêu" />
                </SelectTrigger>
                <SelectContent>
                  {["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Thời lượng (tuần)</label>
              <Input
                type="number"
                min={0}
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
                placeholder="Thời lượng (tuần)"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tổng số buổi</label>
              <Input
                type="number"
                min={0}
                value={totalSessions}
                onChange={(e) => setTotalSessions(e.target.value)}
                placeholder="Tổng số buổi"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Học phí</label>
              <Input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Học phí"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang mở</SelectItem>
                  <SelectItem value="inactive">Tạm ẩn</SelectItem>
                  <SelectItem value="archived">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Các Tags</label>
              <MultiSelectBadge
                options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                value={selectedTagIds}
                onChange={setSelectedTagIds}
                placeholder="Chọn tag khóa học"
                searchPlaceholder="Tìm tag..."
                emptyText="Không có tag phù hợp"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mô tả khóa học</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả khóa học"
              rows={4}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mục tiêu đầu ra</label>
            <Textarea
              value={outputGoal}
              onChange={(e) => setOutputGoal(e.target.value)}
              placeholder="Mục tiêu đầu ra"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_COURSES)}
            >
              Quay lại
            </Button>
            <Button type="button" disabled={isLoading} onClick={() => void handleCreate()}>
              Lưu khóa học
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardCourseCreatePage;
