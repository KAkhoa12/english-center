import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, FileText, Settings, BadgeDollarSign } from "lucide-react";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { MutilImagePicker } from "@/components/Comon/MediaPicker";
import { MutilSelect } from "@/components/Comon/MutilSelect";
import { Select } from "@/components/Comon/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesStore } from "@/services/courses/courses.store";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { useCoursesTagStore } from "@/services/coursesTag/coursesTag.store";
import { format_code, format_slug } from "@/shared/helpers/slug_format";
import { PRIVATE_ROUTES } from "@/shared/routes";

const STATUS_OPTIONS = [
  { key: "Đang hiển thị tuyển sinh", value: "active" },
  { key: "Tạm ẩn (Bản nháp)", value: "inactive" },
  { key: "Lưu trữ nội bộ", value: "archived" },
];

const MODE_OPTIONS = [
  { key: "Center (Khóa học trực tiếp tại trung tâm)", value: "center" },
  { key: "Template (khóa học có sẵn)", value: "template" },
];

const LEVEL_OPTIONS = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => ({
  key: `Trình độ ${level}`,
  value: level,
}));

export const DashboardCourseCreatePage = () => {
  const navigate = useNavigate();
  const createCourse = useCoursesStore((state) => state.createCourse);
  const uploadCourseMediaMany = useCoursesStore((state) => state.uploadCourseMediaMany);
  const isLoading = useCoursesStore((state) => state.isLoading);
  const categories = useCoursesCategoryStore((state) => state.categories);
  const listCategories = useCoursesCategoryStore((state) => state.listCategories);
  const tags = useCoursesTagStore((state) => state.tags);
  const listTags = useCoursesTagStore((state) => state.listTags);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"center" | "template">("center");
  const [targetLevel, setTargetLevel] = useState("A1");
  const [totalSessions, setTotalSessions] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [outputGoal, setOutputGoal] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    void listCategories({ page: 1, page_size: 100, status: "active", sort_by: "name", sort_order: "asc" });
    void listTags({ page: 1, page_size: 100, sort_by: "name", sort_order: "asc" });
  }, [listCategories, listTags]);

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (!slugEdited) {
        setSlug(format_slug(value));
      }
    },
    [slugEdited],
  );

  const handleCreate = useCallback(async () => {
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
        total_sessions: totalSessions.trim() ? Number(totalSessions) : null,
        price: price.trim() ? Number(price) : 0,
        status,
        tag_ids: selectedTagIds.length ? selectedTagIds : null,
        description: description.trim() || null,
        output_goal: outputGoal.trim() || null,
      });

      if (galleryFiles.length) {
        await uploadCourseMediaMany(created.id, galleryFiles);
      }
      toast.success("Tạo khóa học thành công");
      navigate(PRIVATE_ROUTES.DASHBOARD_COURSES_EDIT.replace(":courseId", created.id));
    } catch {
      toast.error("Tạo khóa học thất bại");
    }
  }, [
    name,
    categoryId,
    slug,
    createCourse,
    mode,
    targetLevel,
    totalSessions,
    price,
    status,
    selectedTagIds,
    description,
    outputGoal,
    galleryFiles,
    uploadCourseMediaMany,
    navigate,
  ]);

  const statusValue = useMemo(() => {
    if (status === "inactive") return { key: "Tạm ẩn (Bản nháp)", value: "inactive" };
    if (status === "archived") return { key: "Lưu trữ nội bộ", value: "archived" };
    return { key: "Đang hiển thị tuyển sinh", value: "active" };
  }, [status]);

  const modeValue = useMemo(
    () =>
      mode === "center"
        ? { key: "Center (Khóa học trực tiếp tại trung tâm)", value: "center" }
        : { key: "Template (khóa học có sẵn)", value: "template" },
    [mode],
  );

  const categoryValue = useMemo(
    () =>
      categoryId
        ? { key: categories.find((item) => item.id === categoryId)?.name ?? categoryId, value: categoryId }
        : null,
    [categoryId, categories],
  );

  const targetLevelValue = useMemo(() => ({ key: `Trình độ ${targetLevel}`, value: targetLevel }), [targetLevel]);

  const selectedTagValues = useMemo(
    () =>
      selectedTagIds.map((tagId) => {
        const tag = tags.find((item) => item.id === tagId);
        return { key: tag?.name ?? tagId, value: tagId };
      }),
    [selectedTagIds, tags],
  );

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ key: category.name, value: category.id })),
    [categories],
  );

  const tagOptions = useMemo(() => tags.map((tag) => ({ key: tag.name, value: tag.id })), [tags]);

  return (
    <div className="w-full pb-16">
      <div className="sticky top-[89px] z-50 py-2 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/80 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 py-2  h-16 flex items-center justify-between gap-4">
          <DashboardListPageHeader
            title="Tạo mới khóa học"
            description="Thiết lập cấu hình và nội dung chương trình đào tạo"
          />
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(PRIVATE_ROUTES.DASHBOARD_COURSES)}
              className="h-9 rounded-md border-slate-300 text-slate-700 font-medium hover:bg-slate-100 gap-2 px-3.5 text-xs shadow-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Hủy bỏ
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => void handleCreate()}
              className="h-9 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium gap-2 px-4 text-xs shadow-none"
            >
              <Save className="h-3.5 w-3.5" />
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-none space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <FileText className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Thông tin cơ bản</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide">Tên khóa học</label>
                    <span className="text-[10px] font-medium text-rose-500">Bắt buộc</span>
                  </div>
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ví dụ: Tiếng Anh Giao Tiếp Phản Xạ Pro"
                    className="h-9 rounded-md border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 shadow-none text-sm"
                  />
                  <p className="text-[11px] text-slate-400 font-normal">Tên hiển thị công khai trên cổng học viên.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">Slug đường dẫn nội bộ</label>
                  <Input
                    value={slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setSlug(format_slug(e.target.value));
                    }}
                    placeholder="giao-tiep-phan-xa-pro"
                    className="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-600 font-mono text-xs focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 shadow-none"
                  />
                  <p className="text-[11px] text-slate-400 font-normal">Tự động tạo theo tên nếu để trống.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 tracking-wide">Tóm tắt nội dung khóa học</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngắn gọn về phương pháp giảng dạy, đối tượng phù hợp..."
                  rows={4}
                  className="rounded-md border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 resize-none py-2 text-sm shadow-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 tracking-wide">Cam kết & Mục tiêu đầu ra</label>
                <Textarea
                  value={outputGoal}
                  onChange={(e) => setOutputGoal(e.target.value)}
                  placeholder="Ví dụ: Đạt chứng chỉ CEFR B1, tự tin thuyết trình hội thoại doanh nghiệp..."
                  rows={3}
                  className="rounded-md border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 resize-none py-2 text-sm shadow-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-none space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <BadgeDollarSign className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Thương mại & Thời lượng</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 tracking-wide">Học phí trọn gói</label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="h-9 pl-3 pr-10 rounded-md border-slate-200 font-medium focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 shadow-none text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-slate-400 select-none">VND</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 tracking-wide">Tổng thời lượng phân bổ</label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    value={totalSessions}
                    onChange={(e) => setTotalSessions(e.target.value)}
                    placeholder="Chưa cấu hình"
                    className="h-9 pl-3 pr-12 rounded-md border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 shadow-none text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 select-none">buổi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-visible">

          <MutilImagePicker
            label="Ảnh thư viện khóa học"
            files={galleryFiles}
            onFilesChange={setGalleryFiles}
            disabled={isLoading}
            maxFiles={20}
          />

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-none space-y-4 overflow-visible">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Settings className="h-4 w-4 text-slate-500" />
              <div className="text-xs font-semibold text-slate-700 tracking-wide">Thuộc tính & Phân hệ</div>
            </div>

            <div className="space-y-4 overflow-visible">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Trạng thái phát hành</label>
                <Select
                  value={statusValue}
                  onChange={(option) => setStatus(option?.value ?? "active")}
                  options={STATUS_OPTIONS}
                  placeholder="Chọn trạng thái"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Mô hình phân lớp (Mode)</label>
                <Select
                  value={modeValue}
                  onChange={(option) => setMode((option?.value as "center" | "template") ?? "center")}
                  options={MODE_OPTIONS}
                  placeholder="Chọn mode"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-600">Danh mục chính</label>
                  <span className="text-[10px] font-medium text-rose-500">Bắt buộc</span>
                </div>
                <Select
                  value={categoryValue}
                  onChange={(option) => setCategoryId(option?.value ?? "")}
                  options={categoryOptions}
                  placeholder="Chọn danh mục"
                  is_search
                  searchPlaceholder="Tìm danh mục..."
                  emptyText="Không tìm thấy danh mục"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Trình độ đầu ra tương đương</label>
                <Select
                  value={targetLevelValue}
                  onChange={(option) => setTargetLevel(option?.value ?? "A1")}
                  options={LEVEL_OPTIONS}
                  placeholder="Chọn trình độ"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Phân loại theo nhãn (Tags)</label>
                <MutilSelect
                  value={selectedTagValues}
                  options={tagOptions}
                  onChange={(items) => setSelectedTagIds(items.map((item) => item.value))}
                  placeholder="Chọn thẻ tags..."
                  searchPlaceholder="Tìm tag nhanh..."
                  emptyText="Không tìm thấy kết quả"
                  disabled={isLoading}
                  is_search
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseCreatePage;
