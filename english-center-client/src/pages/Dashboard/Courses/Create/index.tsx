import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardCourseThumbnailField, DashboardListPageHeader } from "@/components/Dashboard/Comon";
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
import { PRIVATE_ROUTES } from "@/shared/routes";

export const DashboardCourseCreatePage = () => {
  const navigate = useNavigate();
  const { createCourse, uploadCourseThumbnail, isLoading } = useCoursesStore();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [targetLevel, setTargetLevel] = useState("A1");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [totalSessions, setTotalSessions] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");
  const [outputGoal, setOutputGoal] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) {
      toast.error("Vui lòng nhập tên và mã khóa học");
      return;
    }

    try {
      const created = await createCourse({
        name: name.trim(),
        code: code.trim(),
        slug: slug.trim() || null,
        target_level: targetLevel || null,
        duration_weeks: durationWeeks.trim() ? Number(durationWeeks) : null,
        total_sessions: totalSessions.trim() ? Number(totalSessions) : null,
        price: price.trim() ? Number(price) : 0,
        status,
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
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên khóa học" />
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã khóa học" />
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />

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

            <Input
              type="number"
              min={0}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(e.target.value)}
              placeholder="Thời lượng (tuần)"
            />
            <Input
              type="number"
              min={0}
              value={totalSessions}
              onChange={(e) => setTotalSessions(e.target.value)}
              placeholder="Tổng số buổi"
            />
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Học phí"
            />

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="archived">archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả khóa học"
            rows={4}
          />

          <Textarea
            value={outputGoal}
            onChange={(e) => setOutputGoal(e.target.value)}
            placeholder="Mục tiêu đầu ra"
            rows={3}
          />

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
