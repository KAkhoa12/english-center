import { create } from "zustand";
import { toast } from "sonner";

import { aiChatApi } from "./aiChat.api";
import type { AiChatMessage } from "./aiChat.type";

const welcomeMessage: AiChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Xin chao, minh la tro ly AI cua StarEnglish. Ban can tu van gi hom nay?",
};

const sessionStorageKey = "advisor_session_id";

type AiChatState = {
  messages: AiChatMessage[];
  sessionId: string | null;
  isStreaming: boolean;
  error: string | null;
  createSession: () => Promise<string>;
  ensureSession: () => Promise<string>;
  sendMessage: (content: string, context: "home" | "dashboard") => Promise<void>;
  reset: () => void;
  clearError: () => void;
};

export const useAiChatStore = create<AiChatState>()((set, get) => ({
  messages: [welcomeMessage],
  sessionId: localStorage.getItem(sessionStorageKey),
  isStreaming: false,
  error: null,

  createSession: async () => {
    const sessionId = await aiChatApi.createSession();
    localStorage.setItem(sessionStorageKey, sessionId);
    set({ sessionId });
    return sessionId;
  },

  ensureSession: async () => {
    const currentSessionId = get().sessionId || localStorage.getItem(sessionStorageKey);
    if (currentSessionId) {
      if (get().sessionId !== currentSessionId) set({ sessionId: currentSessionId });
      return currentSessionId;
    }
    return get().createSession();
  },

  sendMessage: async (content, context) => {
    const text = content.trim();
    if (!text || get().isStreaming) return;

    const userMessage: AiChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
    };
    const assistantId = `${Date.now()}-assistant`;
    const assistantMessage: AiChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
      isStreaming: true,
      error: null,
    }));

    try {
      const sessionId = await get().ensureSession();

      await aiChatApi.streamChat(
        {
          message: text,
          context,
          session_id: sessionId,
          client_message_id: userMessage.id,
        },
        {
          onToken: (token) => {
            set((state) => ({
              messages: state.messages.map((message) =>
                message.id === assistantId ? { ...message, content: message.content + token } : message,
              ),
            }));
          },
          onError: (message) => {
            set({ error: message });
            toast.error(message);
          },
        },
      );
      set({ isStreaming: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Chat AI bi loi";
      set((state) => ({
        isStreaming: false,
        error: message,
        messages: state.messages.map((item) =>
          item.id === assistantId && !item.content
            ? { ...item, content: "Xin loi, hien tai AI chua phan hoi duoc. Vui long thu lai sau." }
            : item,
        ),
      }));
      toast.error(message);
    }
  },

  reset: () => {
    localStorage.removeItem(sessionStorageKey);
    set({ messages: [welcomeMessage], sessionId: null, isStreaming: false, error: null });
  },
  clearError: () => set({ error: null }),
}));
