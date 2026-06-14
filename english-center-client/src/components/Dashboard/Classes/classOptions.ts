export const classTypeOptions = [
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Kết hợp" },
];

export const classStatusOptions = [
  { value: "planned", label: "Dự kiến" },
  { value: "ongoing", label: "Đang diễn ra" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "archived", label: "Lưu trữ" },
];

export const sessionModeOptions = [
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
];

export const sessionStatusOptions = [
  { value: "scheduled", label: "Đã lên lịch" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export const enrollmentStatusOptions = [
  { value: "active", label: "Đang học" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "pending", label: "Chờ xử lý" },
];

export const labelOf = (options: { value: string; label: string }[], value?: string | null) =>
  options.find((item) => item.value === value)?.label ?? value ?? "-";
