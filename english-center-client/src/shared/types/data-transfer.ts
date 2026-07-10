export type DataTransferError = {
  index: number;
  message: string;
  errors?: unknown;
};

export type DataImportResult = {
  entity: "teachers" | "students" | "staff";
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: DataTransferError[];
};
