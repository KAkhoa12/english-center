import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CourseOutcome } from "@/services/courses/courses.type";

type CourseOutcomesEditorProps = {
  items: CourseOutcome[];
  loading?: boolean;
  onCreate: (text: string) => Promise<void>;
  onUpdate: (id: string, text: string, orderIndex: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function CourseOutcomesEditor({
  items,
  loading = false,
  onCreate,
  onUpdate,
  onDelete,
}: CourseOutcomesEditorProps) {
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const sortedItems = useMemo(() => [...items].sort((a, b) => a.order_index - b.order_index), [items]);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Kết quả đầu ra</h3>

      <div className="mt-4 flex gap-2">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Nhập kết quả đầu ra mới..."
        />
        <Button
          type="button"
          disabled={loading || !newText.trim()}
          onClick={async () => {
            await onCreate(newText.trim());
            setNewText("");
          }}
          className="bg-brand-500 text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Thêm
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {sortedItems.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có kết quả đầu ra nào.</p>
        ) : (
          sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-2"
            >
              <span className="text-xs text-gray-400">{index + 1}.</span>
              {editingId === item.id ? (
                <Input value={editingText} onChange={(e) => setEditingText(e.target.value)} />
              ) : (
                <p className="flex-1 text-sm text-gray-700">{item.outcome_text}</p>
              )}
              {editingId === item.id ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={async () => {
                    await onUpdate(item.id, editingText.trim(), item.order_index);
                    setEditingId(null);
                    setEditingText("");
                  }}
                  disabled={!editingText.trim() || loading}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditingText(item.outcome_text);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={async () => onDelete(item.id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

