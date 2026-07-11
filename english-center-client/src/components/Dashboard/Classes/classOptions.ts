export const classTypeOptions = [
  { value: "offline", key: "Offline" },
  { value: "online", key: "Online" },
  { value: "hybrid", key: "Kết hợp" },
];

export const classStatusOptions = [
  { value: "planned", key: "Dự kiến" },
  { value: "ongoing", key: "Đang diễn ra" },
  { value: "completed", key: "Hoàn thành" },
  { value: "cancelled", key: "Đã hủy" },
  { value: "archived", key: "Lưu trữ" },
];

export const sessionModeOptions = [
  { value: "offline", key: "Offline" },
  { value: "online", key: "Online" },
];

export const sessionStatusOptions = [
  { value: "scheduled", key: "Đã lên lịch" },
  { value: "completed", key: "Hoàn thành" },
  { value: "cancelled", key: "Đã hủy" },
];

export const enrollmentStatusOptions = [
  { value: "active", key: "Đang học" },
  { value: "completed", key: "Hoàn thành" },
  { value: "cancelled", key: "Đã hủy" },
  { value: "pending", key: "Chờ xử lý" },
];

export const labelOf = (options: { key: string; label: string }[], key?: string | null) =>
  options.find((item) => item.key === key)?.label ?? key ?? "-";
