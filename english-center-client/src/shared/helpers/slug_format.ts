const normalizeVietnamese = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export const format_slug = (value: string): string =>
  normalizeVietnamese(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const format_code = (value: string): string =>
  normalizeVietnamese(value)
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9\s_]/g, "")
    .replace(/[\s_]+/g, "_")
    .replace(/^_+|_+$/g, "");
