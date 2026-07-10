export type EditorJsBlock = {
  type: string;
  data: Record<string, unknown>;
};

export type EditorJsDocument = {
  time: number;
  blocks: EditorJsBlock[];
  version: string;
};
