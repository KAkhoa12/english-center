import { Bot, Headset, Loader2, MessageCircle, Send, User, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAiChatStore } from "@/services/aiChat/aiChat.store";


const renderInlineMarkdown = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return <strong key={key} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key} className="rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-800">{part.slice(1, -1)}</code>;
    }
    return part;
  });

const renderMarkdownMessage = (content: string) => {
  const blocks = content.split(/\n{2,}/).filter((block) => block.trim());
  return (
    <div className="space-y-2">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim());
        const heading = lines.length === 1 ? lines[0].match(/^(#{1,3})\s+(.+)$/) : null;
        const isBulletList = lines.every((line) => /^[-*]\s+/.test(line.trim()));
        const isNumberedList = lines.every((line) => /^\d+[.)]\s+/.test(line.trim()));
        if (heading) {
          return (
            <p key={`heading-${blockIndex}`} className="text-sm font-semibold text-gray-900">
              {renderInlineMarkdown(heading[2], `heading-${blockIndex}`)}
            </p>
          );
        }
        if (isBulletList) {
          return (
            <ul key={`list-${blockIndex}`} className="ml-4 list-disc space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={`bullet-${blockIndex}-${lineIndex}`}>
                  {renderInlineMarkdown(line.trim().replace(/^[-*]\s+/, ""), `bullet-${blockIndex}-${lineIndex}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (isNumberedList) {
          return (
            <ol key={`list-${blockIndex}`} className="ml-4 list-decimal space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={`number-${blockIndex}-${lineIndex}`}>
                  {renderInlineMarkdown(line.trim().replace(/^\d+[.)]\s+/, ""), `number-${blockIndex}-${lineIndex}`)}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={`paragraph-${blockIndex}`}>
            {lines.map((line, lineIndex) => (
              <span key={`line-${blockIndex}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderInlineMarkdown(line, `line-${blockIndex}-${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
};

function AiChatTab() {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, isStreaming, sendMessage } = useAiChatStore();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    void sendMessage(content, "home");
  };

  return (
    <>
      <div ref={scrollRef} className="max-h-[340px] space-y-3 overflow-y-auto bg-gray-50 p-4">
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
              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "whitespace-pre-wrap rounded-br-md bg-brand-500 text-white"
                  : "rounded-bl-md bg-white text-gray-700 shadow-sm"
              }`}
            >
              {message.content ? (
                message.role === "assistant" ? renderMarkdownMessage(message.content) : message.content
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
              )}
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
          onKeyDown={(event) => { if (event.key === "Enter") handleSend(); }}
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
    </>
  );
}

function ConsultantChatTab() {
  return <ContactForm />;
}

function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.message || "Gui thong tin that bai");
      }
    } catch {
      toast.error("Khong the gui thong tin, vui long thu lai");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Headset className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-gray-800">Cam on ban!</p>
        <p className="text-xs text-gray-500">Tu van vien se lien he trong thoi gian som nhat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-800">Chat voi tu van vien</p>
        <p className="mt-1 text-xs text-gray-500">De lai thong tin, chung toi se lien he ban ngay.</p>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ho ten cua ban"
        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="So dien thoai"
        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="button"
        disabled={sending || !name.trim() || !phone.trim()}
        onClick={handleSubmit}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gui thong tin"}
      </button>
    </div>
  );
}

export default function ChatbotPopup() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((v) => !v);

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open ? (
        <div className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-brand-500/10">
          <div className="flex items-center justify-between bg-brand-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">StarEnglish</p>
                <p className="text-xs text-white/80">Ho tro truc tuyen</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dong"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Tabs defaultValue="ai" className="w-full">
            <div className="border-b border-gray-100 px-4 pt-2">
              <TabsList className="w-full bg-transparent">
                <TabsTrigger value="ai" className="flex-1 gap-1.5 text-xs data-[state=active]:text-brand-600">
                  <Bot className="h-3.5 w-3.5" />
                  AI 24/7
                </TabsTrigger>
                <TabsTrigger value="consultant" className="flex-1 gap-1.5 text-xs data-[state=active]:text-brand-600">
                  <Headset className="h-3.5 w-3.5" />
                  TVV Truc tiep
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="ai" className="mt-0">
              <AiChatTab />
            </TabsContent>
            <TabsContent value="consultant" className="mt-0">
              <ConsultantChatTab />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Mo tro chuyen"
        onClick={handleToggle}
        className="mt-3 ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl shadow-brand-500/35 transition-all hover:scale-105 hover:bg-brand-600"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
