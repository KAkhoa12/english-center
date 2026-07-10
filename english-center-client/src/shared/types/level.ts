export const LEVEL_KEYS = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type LevelKey = (typeof LEVEL_KEYS)[number];

export type LevelOption = {
  key: LevelKey;
  label: string;
  description: string;
};

export const LEVEL_OPTIONS: LevelOption[] = [
  {
    key: "A0",
    label: "A0",
    description: "Chưa biết gì cả",
  },
  {
    key: "A1",
    label: "A1",
    description: "Biết được 1 chút",
  },
  {
    key: "A2",
    label: "A2",
    description: "Có nền tảng cơ bản",
  },
  {
    key: "B1",
    label: "B1",
    description: "Có thể giao tiếp đơn giản",
  },
  {
    key: "B2",
    label: "B2",
    description: "Giao tiếp từ tin học",
  },
  {
    key: "C1",
    label: "C1",
    description: "Dùng ngôn ngữ nâng cao",
  },
  {
    key: "C2",
    label: "C2",
    description: "Thông thao gần như bạn",
  },
];

export const LEVEL_LABEL_BY_KEY: Record<LevelKey, string> = {
  A0: "Chưa biết gì cả",
  A1: "Biết được 1 chút",
  A2: "Có nền tảng cơ bản",
  B1: "Có thể giao tiếp đơn giản",
  B2: "Giao tiếp từ tin học",
  C1: "Dùng ngôn ngữ nâng cao",
  C2: "Thông thao gần như bạn",
};

export const getLevelLabel = (key: string | null | undefined): string => {
  if (!key) return "";
  return LEVEL_LABEL_BY_KEY[key as LevelKey] ?? key;
};

export const getLevelOption = (key: string | null | undefined): LevelOption | null => {
  if (!key) return null;
  const normalized = key as LevelKey;
  const option = LEVEL_OPTIONS.find((item) => item.key === normalized);
  return option ?? null;
};

export const toLevelKey = (value: string | null | undefined): LevelKey | null => {
  if (!value) return null;
  return LEVEL_KEYS.includes(value as LevelKey) ? (value as LevelKey) : null;
};
