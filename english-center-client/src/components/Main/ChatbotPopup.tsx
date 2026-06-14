import { Bot, Loader2, MessageCircle, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAiChatStore } from "@/services/aiChat/aiChat.store";

export default function ChatbotPopup() {
  const [open, setOpen] = useState(false);
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
    void sendMessage(content, "home");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open ? (
        <div className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-brand-500/10">
          <div className="flex items-center justify-between bg-brand-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">StarEnglish AI</p>
                <p className="text-xs text-white/80">Tu van nhanh 24/7</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dong chatbot"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-[420px] space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                ) : null}
                <div
                  className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-brand-500 text-white"
                      : "rounded-bl-md bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  {message.content || <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
                </div>
                {message.role === "user" ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                    <User className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
            <input
              value={draft}
              disabled={isStreaming}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Nhap cau hoi cua ban..."
              className="h-10 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isStreaming || !draft.trim()}
              onClick={handleSend}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Mo chatbot AI"
        onClick={() => setOpen((value) => !value)}
        className="mt-3 ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl shadow-brand-500/35 transition-all hover:scale-105 hover:bg-brand-600"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
