import {
  Bot,
  FileText,
  Image,
  Loader2,
  Paperclip,
  Search,
  Send,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/services/auth/auth.store";
import { useChatStore } from "@/services/chat/chat.store";
import type { ChatConversation, ChatMessage, ChatUser } from "@/services/chat/chat.type";
import { useFilesStore } from "@/services/files/files.store";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(
    new Date(value),
  );

const roleLabel = (contact?: ChatUser | null) => {
  if (!contact) return "Nguoi dung";
  if (contact.contact_type === "teacher" || contact.roles.includes("teacher")) return "Giang vien";
  if (contact.contact_type === "student" || contact.roles.includes("student")) return "Hoc vien";
  if (contact.contact_type === "manager" || contact.roles.some((role) => ["admin", "staff", "manager"].includes(role))) {
    return "Quan ly";
  }
  return "Nguoi dung";
};

const otherParticipant = (conversation: ChatConversation | null, currentUserId?: string) =>
  conversation?.participants.find((participant) => participant.id !== currentUserId) ?? conversation?.participants[0] ?? null;

export default function DashboardMessagesPage() {
  const currentUser = useAuthStore((state) => state.me?.user);
  const uploadFile = useFilesStore((state) => state.uploadFile);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const {
    contacts,
    conversations,
    activeConversation,
    messages,
    isLoading,
    isSending,
    isSocketConnected,
    fetchContacts,
    fetchConversations,
    fetchMessages,
    openConversationWith,
    setActiveConversation,
    sendMessage,
    connectSocket,
    disconnectSocket,
  } = useChatStore();

  useEffect(() => {
    void fetchContacts();
    void fetchConversations();
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket, fetchContacts, fetchConversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeConversation?.id]);

  const activeUser = otherParticipant(activeConversation, currentUser?.id);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) =>
      [contact.full_name, contact.email, contact.phone ?? "", roleLabel(contact)].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [contacts, search]);

  const handleOpenConversation = async (contact: ChatUser) => {
    await openConversationWith(contact.id);
  };

  const handleOpenExistingConversation = async (conversation: ChatConversation) => {
    setActiveConversation(conversation);
    await fetchMessages(conversation.id);
  };

  const handleAttachFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setPendingFiles((current) => [...current, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!activeConversation || (!content && pendingFiles.length === 0)) return;

    try {
      const attachments = await Promise.all(
        pendingFiles.map(async (file) => {
          const uploaded = await uploadFile(file, "material", "chat");
          return {
            bucket: uploaded.bucket,
            object_name: uploaded.object_name,
            original_filename: uploaded.original_filename,
            content_type: uploaded.content_type,
            size: uploaded.size,
            url: uploaded.presigned_url,
          };
        }),
      );

      await sendMessage({
        conversation_id: activeConversation.id,
        content,
        attachments,
      });
      setDraft("");
      setPendingFiles([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gui tin nhan that bai";
      toast.error(message);
    }
  };

  return (
    <section className="space-y-5">
      <DashboardListPageHeader
        title="Tin nhan"
        description="Trao doi realtime giua hoc vien, giang vien va quan ly trung tam"
      />

      <div className="grid min-h-[calc(100vh-220px)] gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Nguoi nhan tin">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-2">
                {isSocketConnected ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-amber-500" />}
                {isSocketConnected ? "Dang ket noi realtime" : "Dang dung REST fallback"}
              </span>
              <span>{contacts.length} lien he</span>
            </div>

            <label className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-400 shadow-sm">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tim ten, email, vai tro..."
                className="w-full border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </label>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Lien he hop le</p>
              <div className="max-h-[310px] space-y-2 overflow-y-auto pr-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => void handleOpenConversation(contact)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left transition hover:border-brand-100 hover:bg-brand-50/50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-sm font-bold text-brand-700">
                      {getInitials(contact.full_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{contact.full_name}</p>
                      <p className="truncate text-xs text-gray-500">{roleLabel(contact)} - {contact.email}</p>
                    </div>
                  </button>
                ))}
                {!filteredContacts.length ? <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">Khong co lien he phu hop.</p> : null}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Hoi thoai gan day</p>
              <div className="max-h-[240px] space-y-2 overflow-y-auto pr-1">
                {conversations.map((conversation) => {
                  const other = otherParticipant(conversation, currentUser?.id);
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => void handleOpenExistingConversation(conversation)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        activeConversation?.id === conversation.id
                          ? "border-brand-200 bg-brand-50"
                          : "border-gray-100 bg-white hover:border-brand-100"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xs font-bold text-gray-700">
                        {getInitials(other?.full_name ?? "Chat")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{conversation.title ?? other?.full_name ?? "Hoi thoai"}</p>
                        <p className="truncate text-xs text-gray-500">{conversation.last_message?.content ?? "Chua co tin nhan"}</p>
                      </div>
                    </button>
                  );
                })}
                {!conversations.length ? <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">Chua co hoi thoai nao.</p> : null}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={activeUser ? activeUser.full_name : "Khung chat"}>
          {activeConversation ? (
            <div className="flex min-h-[650px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-sm font-bold text-white">
                    {getInitials(activeUser?.full_name ?? "Chat")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-950">{activeUser?.full_name ?? "Hoi thoai"}</p>
                    <p className="text-sm text-gray-500">{roleLabel(activeUser)} {activeUser?.class_ids?.length ? `- ${activeUser.class_ids.length} lop chung` : ""}</p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 sm:flex">
                  <Users className="h-3.5 w-3.5" />
                  {activeConversation.participants.length} thanh vien
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-4 py-5 sm:px-6">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dang tai tin nhan...
                  </div>
                ) : null}
                {!isLoading && messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isMine={message.sender_id === currentUser?.id} />
                ))}
                {!isLoading && !messages.length ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                    <Bot className="mb-3 h-10 w-10 text-brand-300" />
                    <p className="font-semibold text-gray-700">Bat dau cuoc tro chuyen</p>
                    <p className="mt-1 text-sm">Gui tin nhan dau tien cho {activeUser?.full_name}.</p>
                  </div>
                ) : null}
              </div>

              {pendingFiles.length ? (
                <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white px-4 py-3">
                  {pendingFiles.map((file, index) => (
                    <span key={`${file.name}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                      {file.type.startsWith("image/") ? <Image className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                      {file.name}
                      <button
                        type="button"
                        onClick={() => setPendingFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                        className="rounded-full p-0.5 hover:bg-brand-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="flex items-end gap-2 border-t border-gray-100 bg-white p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => handleAttachFiles(event.target.files)}
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={draft}
                  disabled={isSending}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Nhap tin nhan..."
                  className="min-h-11"
                />
                <Button type="button" disabled={isSending || (!draft.trim() && pendingFiles.length === 0)} onClick={() => void handleSend()} className="shrink-0">
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[650px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-950">Chon nguoi de bat dau nhan tin</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
                Danh sach da duoc loc theo vai tro va lop hoc: hoc vien cung lop, giang vien phu trach, hoc vien cua giang vien, hoac quan ly noi bo.
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </section>
  );
}

function MessageBubble({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[82%] space-y-2 rounded-3xl px-4 py-3 text-sm shadow-sm ${isMine ? "bg-brand-500 text-white" : "border border-gray-100 bg-white text-gray-700"}`}>
        {message.content ? <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p> : null}
        {message.attachments.length ? (
          <div className="space-y-2">
            {message.attachments.map((attachment) => {
              const isImage = (attachment.content_type ?? "").startsWith("image/");
              return (
                <a
                  key={attachment.id}
                  href={attachment.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium ${isMine ? "bg-white/15 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  {isImage ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  <span className="truncate">{attachment.original_filename ?? attachment.object_name}</span>
                </a>
              );
            })}
          </div>
        ) : null}
        <p className={`text-[11px] ${isMine ? "text-white/70" : "text-gray-400"}`}>{formatTime(message.created_at)}</p>
      </div>
    </div>
  );
}
