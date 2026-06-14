import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAiChatStore } from "@/services/aiChat/aiChat.store";

type DashboardAiChatSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DashboardAiChatSheet({ open, onOpenChange }: DashboardAiChatSheetProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, isStreaming, sendMessage } = useAiChatStore();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    void sendMessage(content, "dashboard");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col border-l border-gray-100 bg-white p-0 sm:max-w-[430px]">
        <SheetHeader className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Tro ly AI</SheetTitle>
              <SheetDescription>Hoi nhanh ve khoa hoc, lop hoc, lich hoc va bai tap.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-5 py-5">
          <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Sparkles className="h-4 w-4" />
              Goi y nhanh
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Hoi ve lich hoc hom nay, trang thai bai tap, danh sach lop hoac tien do hoc tap.
            </p>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-brand-500 text-white"
                    : "border border-gray-100 bg-white text-gray-600 shadow-sm"
                }`}
              >
                {message.content || <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="border-t border-gray-100 bg-white p-4">
          <div className="flex w-full items-center gap-2">
            <Input
              value={draft}
              disabled={isStreaming}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Nhap cau hoi cho AI..."
            />
            <Button type="button" disabled={isStreaming || !draft.trim()} onClick={handleSend} className="shrink-0">
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
