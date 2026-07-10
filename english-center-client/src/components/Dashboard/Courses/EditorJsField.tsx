import { useEffect, useRef } from "react";

import { loadEditorJs } from "@/shared/helpers/editorjs-loader";
import type { EditorJsDocument } from "@/shared/types/editorjs";
import { createEmptyEditorJsDocument } from "@/shared/helpers/editorjs";

type EditorJsFieldProps = {
  value: EditorJsDocument | null;
  onChange: (value: EditorJsDocument | null) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
};

export const EditorJsField = ({
  value,
  onChange,
  placeholder = "Nhập nội dung bài học",
  minHeight = 320,
  disabled = false,
}: EditorJsFieldProps) => {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<EditorJsDocument | null>(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!holderRef.current) return;

    let editor: any;
    let mounted = true;

    const bootstrap = async () => {
      const { EditorJS, Header, List, Marker } = await loadEditorJs();

      if (!mounted || !holderRef.current) return;

      editor = new EditorJS({
        holder: holderRef.current,
        placeholder,
        readOnly: disabled,
        data: value ?? createEmptyEditorJsDocument(),
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          marker: {
            class: Marker,
          },
        },
        onChange: async () => {
          try {
            const data = await editor.save();
            onChangeRef.current(data as EditorJsDocument);
          } catch {
            onChangeRef.current(valueRef.current ?? createEmptyEditorJsDocument());
          }
        },
      });
    };

    void bootstrap();

    return () => {
      mounted = false;
      if (editor && typeof editor.destroy === "function") {
        editor.destroy();
      }
    };
  }, [disabled, placeholder]);

  return <div ref={holderRef} className="rounded-2xl border border-gray-200 bg-white px-4 py-3" style={{ minHeight }} />;
};
