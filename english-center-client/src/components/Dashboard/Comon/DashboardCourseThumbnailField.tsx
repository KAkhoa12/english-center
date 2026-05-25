import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";

type DashboardCourseThumbnailFieldProps = {
  currentImageUrl?: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
};

export const DashboardCourseThumbnailField = ({
  currentImageUrl = null,
  file,
  onFileChange,
  disabled = false,
}: DashboardCourseThumbnailFieldProps) => {
  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const imageSrc = previewUrl ?? currentImageUrl ?? null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Ảnh khóa học</h3>
        <p className="mt-1 text-sm text-gray-500">
          Chọn ảnh thumbnail đại diện cho khóa học (jpg, png, webp).
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="h-40 w-full max-w-xs overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50">
          {imageSrc ? (
            <img src={imageSrc} alt="Course thumbnail" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Chưa có ảnh
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ImagePlus className="h-4 w-4" />
            Chọn ảnh
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={disabled}
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                onFileChange(nextFile);
              }}
            />
          </label>

          <Button
            type="button"
            variant="outline"
            disabled={!file || disabled}
            onClick={() => onFileChange(null)}
          >
            <X className="h-4 w-4" />
            Bỏ ảnh mới chọn
          </Button>
        </div>
      </div>
    </div>
  );
};
