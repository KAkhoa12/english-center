import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Eye, FileText, Image, Trash2, Upload, X, Video, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

type BasePickerProps = {
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

type SinglePickerProps = BasePickerProps & {
  file: File | null;
  onFileChange: (file: File | null) => void;
  currentUrl?: string | null;
};

type MultiPickerProps = BasePickerProps & {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  items?: Array<{ id: string; name: string; src: string }>;
  readOnly?: boolean;
  onUploadFiles?: (files: File[]) => Promise<void> | void;
  onDeleteItem?: (itemId: string) => Promise<void> | void;
  onSetPrimary?: (itemId: string) => Promise<void> | void;
  uploadLabel?: string;
  clearAfterUpload?: boolean;
};

const DEFAULT_IMAGE_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif";
const DEFAULT_VIDEO_ACCEPT = "video/mp4,video/webm,video/ogg";
const DEFAULT_FILE_ACCEPT = ".txt,.doc,.docx,.pdf,.csv,.json,.md";

const useObjectUrl = (file: File | null) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url;
};

const useObjectUrls = (files: File[]) => {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  return urls;
};

type DisplayItem = {
  id: string;
  name: string;
  src: string;
  size: number | null;
  origin: "remote" | "local";
  fileIndex?: number;
};
const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) => {
  if (!open) return null;
  return (
    <div
      // Thay đổi thành bg-black/60 giúp nền có màu đen mờ sâu và sang trọng hơn
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-md bg-white/10 border border-white/10 p-2 text-white/80 shadow-sm transition-colors hover:bg-white/20 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
};

const BaseCard = ({ label, description, children, className }: BasePickerProps & { children: ReactNode }) => (
  <div className={cn("rounded-md border border-slate-200 bg-white p-5 shadow-none", className)}>
    {label ? <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{label}</h3> : null}
    {description ? <p className="mt-0.5 text-xs text-slate-500 font-normal">{description}</p> : null}
    <div className="mt-4">{children}</div>
  </div>
);

const SinglePreview = ({
  src,
  kind,
  onView,
  onRemove,
  placeholder,
  onSelectClick,
  disabled,
}: {
  src: string | null;
  kind: "image" | "video" | "file";
  onView: () => void;
  onRemove: () => void;
  placeholder: string;
  onSelectClick: () => void;
  disabled?: boolean;
}) => (
  <div className="space-y-3">
    <div
      onClick={!src && !disabled ? onSelectClick : undefined}
      className={cn(
        "relative flex h-48 w-full items-center justify-center rounded-md border bg-slate-100/60 overflow-hidden transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]",
        src ? "border-slate-200" : "border-dashed border-slate-300",
        !src && !disabled && "hover:bg-slate-100 hover:border-slate-400 cursor-pointer group"
      )}
    >
      {src ? (
        kind === "video" ? (
          <video src={src} className="h-full w-full object-contain bg-slate-900" muted />
        ) : kind === "image" ? (
          <img src={src} alt={placeholder} className="h-full w-full object-contain bg-slate-50/50" />
        ) : (
          <div className="flex flex-col items-center gap-2.5 p-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 max-w-xs truncate px-2">{placeholder}</span>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center gap-2.5 p-6 text-center select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm group-hover:border-slate-300 transition-colors">
            {kind === "image" ? <Image className="h-4 w-4 text-slate-600" /> : kind === "video" ? <Video className="h-4 w-4 text-slate-600" /> : <FileUp className="h-4 w-4 text-slate-600" />}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-slate-800">Click để tải tệp tin lên</p>
            <p className="text-[11px] text-slate-500 font-medium">Hệ thống hỗ trợ tự động tối ưu hóa dữ liệu</p>
          </div>
        </div>
      )}
    </div>

    {src && (
      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        {kind !== "file" && (
          <button
            type="button"
            onClick={onView}
            className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-none transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            Xem trước
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-8 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-600 shadow-none transition-colors hover:bg-red-50 hover:text-red-700"
          disabled={disabled}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Gỡ bỏ tệp
        </button>
      </div>
    )}
  </div>
);

export const ImagePicker = ({
  label = "Hình ảnh đại diện",
  description,
  file,
  currentUrl = null,
  onFileChange,
  disabled = false,
  className,
}: SinglePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = useObjectUrl(file);
  const [open, setOpen] = useState(false);
  const src = previewUrl ?? currentUrl ?? null;

  return (
    <BaseCard label={label} description={description} className={className}>
      <SinglePreview
        kind="image"
        src={src}
        placeholder={file?.name ?? "Chưa có ảnh"}
        onView={() => setOpen(true)}
        onRemove={() => onFileChange(null)}
        onSelectClick={() => inputRef.current?.click()}
        disabled={disabled}
      />
      <input
        ref={inputRef}
        type="file"
        accept={DEFAULT_IMAGE_ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          onFileChange(nextFile);
          event.currentTarget.value = "";
        }}
      />
      <Modal open={open && !!src} onClose={() => setOpen(false)}>
        {src ? (
          <div className="relative flex max-h-[85vh] max-w-5xl items-center justify-center p-2 bg-white rounded-md border border-slate-200 shadow-xl">
            <img src={src} alt={label} className="max-h-[80vh] max-w-full rounded-sm object-contain" />
          </div>
        ) : null}
      </Modal>
    </BaseCard>
  );
};

export const VideoPicker = ({
  label = "Video bài giảng",
  description,
  file,
  currentUrl = null,
  onFileChange,
  disabled = false,
  className,
}: SinglePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = useObjectUrl(file);
  const [open, setOpen] = useState(false);
  const src = previewUrl ?? currentUrl ?? null;

  return (
    <BaseCard label={label} description={description} className={className}>
      <SinglePreview
        kind="video"
        src={src}
        placeholder={file?.name ?? "Chưa có video"}
        onView={() => setOpen(true)}
        onRemove={() => onFileChange(null)}
        onSelectClick={() => inputRef.current?.click()}
        disabled={disabled}
      />
      <input
        ref={inputRef}
        type="file"
        accept={DEFAULT_VIDEO_ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          onFileChange(nextFile);
          event.currentTarget.value = "";
        }}
      />
      <Modal open={open && !!src} onClose={() => setOpen(false)}>
        {src ? (
          <div className="relative w-full max-w-4xl p-2 bg-white rounded-md border border-slate-200 shadow-xl">
            <video src={src} controls autoPlay className="max-h-[80vh] w-full rounded-sm bg-slate-950" />
          </div>
        ) : null}
      </Modal>
    </BaseCard>
  );
};

export const FilePicker = ({
  label = "Tài liệu đính kèm",
  description,
  file,
  onFileChange,
  disabled = false,
  className,
}: SinglePickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <BaseCard label={label} description={description} className={className}>
      <SinglePreview
        kind="file"
        src={file ? "selected" : null}
        placeholder={file?.name ?? "Chưa có cấu hình file"}
        onView={() => {}}
        onRemove={() => onFileChange(null)}
        onSelectClick={() => inputRef.current?.click()}
        disabled={disabled}
      />
      <input
        ref={inputRef}
        type="file"
        accept={DEFAULT_FILE_ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          onFileChange(nextFile);
          event.currentTarget.value = "";
        }}
      />
    </BaseCard>
  );
};

const MultiPicker = ({
  label,
  description,
  files,
  onFilesChange,
  disabled = false,
  className,
  maxFiles,
  items = [],
  readOnly = false,
  onUploadFiles,
  onDeleteItem,
  onSetPrimary,
  uploadLabel = "Tải lên",
  clearAfterUpload = true,
  kind,
}: MultiPickerProps & { kind: "image" | "video" | "file" }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const urls = useObjectUrls(files);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);

  const displayItems: DisplayItem[] = [
    ...items.map((item) => ({
      id: item.id,
      name: item.name,
      src: item.src,
      size: null as number | null,
      origin: "remote" as const,
    })),
    ...files.map((file, index) => ({
      id: `file-${index}-${file.name}-${file.size}`,
      name: file.name,
      src: urls[index],
      size: file.size,
      fileIndex: index,
      file,
      origin: "local" as const,
    })),
  ];

  useEffect(() => {
    setLoaded({});
  }, [files, items]);

  const openAt = (index: number) => setPreviewIndex(index);
  const close = () => setPreviewIndex(null);
  const count = displayItems.length;

  const step = (delta: number) => {
    if (count === 0 || previewIndex === null) return;
    const next = (previewIndex + delta + count) % count;
    setPreviewIndex(next);
  };

  const isLimitReached = typeof maxFiles === "number" && files.length >= maxFiles;
  const hasLocalFiles = files.length > 0;

  const handleUpload = async () => {
    if (!onUploadFiles || !hasLocalFiles || uploading || disabled) return;
    setUploading(true);
    try {
      await onUploadFiles(files);
      if (clearAfterUpload) onFilesChange([]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseCard label={label} description={description} className={className}>
      {!readOnly ? (
        <div className="space-y-3">
          <div
            onClick={!disabled && !isLimitReached ? () => inputRef.current?.click() : undefined}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-md border border-dashed border-slate-300 bg-slate-100/60 text-center transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]",
              !disabled && !isLimitReached && "hover:bg-slate-100 hover:border-slate-400 cursor-pointer group"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm group-hover:border-slate-300 transition-colors mb-2.5">
              <Upload className="h-4 w-4 text-slate-600" />
            </div>
            <p className="text-xs font-semibold text-slate-800">Tải lên hàng loạt các tệp tin</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Hỗ trợ chọn nhiều tệp cùng lúc {maxFiles ? `(Tối đa ${maxFiles} file)` : ""}</p>

          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={kind === "image" ? DEFAULT_IMAGE_ACCEPT : kind === "video" ? DEFAULT_VIDEO_ACCEPT : DEFAULT_FILE_ACCEPT}
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? []);
              if (!nextFiles.length) return;
              onFilesChange(typeof maxFiles === "number" ? [...files, ...nextFiles].slice(0, maxFiles) : [...files, ...nextFiles]);
              event.currentTarget.value = "";
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
              disabled={disabled || isLimitReached}
            >
              Chọn ảnh
            </button>
            <button
              type="button"
              onClick={() => void handleUpload()}
              className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || uploading || !hasLocalFiles || !onUploadFiles}
            >
              {uploading ? "Đang tải..." : uploadLabel}
            </button>
          </div>
        </div>
      ) : null}

      {displayItems.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {displayItems.map((item, index) => {
            const isFile = item.origin === "local";
            const src = item.src;
            const isLoaded = loaded[item.id];
            return (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-md border border-slate-200 bg-white hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-4 transition-all">
                <button
                  type="button"
                  className="flex flex-1 items-center gap-3 min-w-0 text-left group/btn"
                  onClick={() => openAt(index)}
                >
                  <div className="relative h-10 w-16 shrink-0 rounded bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    {kind === "file" ? (
                      <FileText className="h-4 w-4 text-slate-400" />
                    ) : kind === "video" ? (
                      <>
                        <video src={src} className="h-full w-full object-cover" onLoadedData={() => setLoaded((s) => ({ ...s, [item.id]: true }))} />
                        {!isLoaded && <div className="absolute inset-0 animate-pulse bg-slate-200/60" />}
                      </>
                    ) : (
                      <>
                        <img src={src} alt={item.name} className="h-full w-full object-cover" onLoad={() => setLoaded((s) => ({ ...s, [item.id]: true }))} />
                        {!isLoaded && <div className="absolute inset-0 animate-pulse bg-slate-200/60" />}
                      </>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 group-hover/btn:text-slate-900 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{isFile && item.size ? `${Math.round(item.size / 1024)} KB` : "Ảnh có sẵn"}</p>
                  </div>
                </button>

                <div className="flex items-center shrink-0 gap-1.5">
                  {!readOnly && item.origin === "remote" && onSetPrimary && kind === "image" ? (
                    <button
                      type="button"
                      onClick={() => void onSetPrimary(item.id)}
                      className="inline-flex h-7 items-center justify-center rounded-md border border-brand-200 bg-brand-50 px-2.5 text-[11px] font-medium text-brand-700 hover:bg-brand-100 transition-colors shadow-none"
                    >
                      Làm đại diện
                    </button>
                  ) : null}
                  {kind !== "file" && !readOnly && (
                    <button
                      type="button"
                      onClick={() => openAt(index)}
                      className="inline-flex h-7 items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-none"
                    >
                      Xem bản gốc
                    </button>
                  )}
                  {!readOnly && isFile ? (
                    <button
                      type="button"
                      onClick={() => onFilesChange(files.filter((_, c) => c !== item.fileIndex))}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-red-600 border border-transparent hover:border-slate-200/60 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : !readOnly && onDeleteItem && item.origin === "remote" ? (
                    <button
                      type="button"
                      onClick={() => void onDeleteItem(item.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-red-600 border border-transparent hover:border-slate-200/60 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={previewIndex !== null && count > 0} onClose={close}>
        {previewIndex !== null && count > 0 ? (
          <div className="relative flex w-full max-w-5xl items-center justify-center">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-md bg-white border border-slate-200 p-2 text-slate-700 shadow-md hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-md bg-white border border-slate-200 p-2 text-slate-700 shadow-md hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="max-h-[85vh] w-full px-12">
              {kind === "file" ? (
                <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-800 max-w-md mx-auto shadow-xl">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{files[previewIndex].name}</h4>
                  <p className="mt-1 text-xs text-slate-500">{files[previewIndex].type || "Unknown Type"}</p>
                </div>
              ) : kind === "video" ? (
                <div className="p-2 bg-white rounded-md border border-slate-200 shadow-xl">
                  <video src={urls[previewIndex]} controls autoPlay className="max-h-[80vh] w-full rounded-sm bg-slate-950" />
                </div>
              ) : (
                <div className="p-2 bg-white rounded-md border border-slate-200 shadow-xl flex items-center justify-center">
                  <img src={displayItems[previewIndex].src} alt={displayItems[previewIndex].name} className="max-h-[80vh] max-w-full rounded-sm object-contain" />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </BaseCard>
  );
};

export const MutilImagePicker = (props: MultiPickerProps) => <MultiPicker {...props} kind="image" />;
export const MutilVideoPicker = (props: MultiPickerProps) => <MultiPicker {...props} kind="video" />;
export const MutilFilePicker = (props: MultiPickerProps) => <MultiPicker {...props} kind="file" />;

export default ImagePicker;
