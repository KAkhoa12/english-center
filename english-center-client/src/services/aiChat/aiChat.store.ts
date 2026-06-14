import { create } from "zustand";
import { toast } from "sonner";

import { aiChatApi } from "./aiChat.api";
import type { AiChatMessage } from "./aiChat.type";

const welcomeMessage: AiChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Xin chao, minh la tro ly AI cua StarEnglish. Ban can tu van gi hom nay?",
};

type AiChatState = {
  messages: AiChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string, context: "home" | "dashboard") => Promise<void>;
  reset: () => void;
  clearError: () => void;
};

export const useAiChatStore = create<AiChatState>()((set, get) => ({
  messages: [welcomeMessage],
  isStreaming: false,
  error: null,

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
      await aiChatApi.streamChat(
        { message: text, context },
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

  reset: () => set({ messages: [welcomeMessage], isStreaming: false, error: null }),
  clearError: () => set({ error: null }),
}));
