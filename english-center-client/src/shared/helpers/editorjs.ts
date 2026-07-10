import type { EditorJsDocument } from "@/shared/types/editorjs";

const VERSION = "2.30.8";

export const createEmptyEditorJsDocument = (): EditorJsDocument => ({
  time: Date.now(),
  blocks: [
    {
      type: "paragraph",
      data: { text: "" },
    },
  ],
  version: VERSION,
});

export const normalizeEditorJsDocument = (value: unknown): EditorJsDocument | null => {
  if (value === null || value === undefined) return null;

  if (typeof value === "object") {
    const candidate = value as Partial<EditorJsDocument> & { blocks?: unknown };
    if (Array.isArray(candidate.blocks)) {
      return {
        time: typeof candidate.time === "number" ? candidate.time : Date.now(),
        blocks: candidate.blocks as EditorJsDocument["blocks"],
        version: typeof candidate.version === "string" ? candidate.version : VERSION,
      };
    }
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const normalized = normalizeEditorJsDocument(parsed);
      if (normalized) return normalized;
    } catch {
      return {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: { text: trimmed },
          },
        ],
        version: VERSION,
      };
    }
  }

  return {
    time: Date.now(),
    blocks: [
      {
        type: "paragraph",
        data: { text: String(value) },
      },
    ],
    version: VERSION,
  };
};
