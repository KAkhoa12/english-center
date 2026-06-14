import { create } from "zustand";
import { toast } from "sonner";

import type { ApiResponse } from "@/shared/types/response";
import { useAuthStore } from "@/services/auth/auth.store";

import { chatApi } from "./chat.api";
import type {
  ChatConversation,
  ChatMessage,
  ChatSocketEvent,
  ChatUser,
  SendMessageRequest,
} from "./chat.type";
import { ChatSocketClient } from "./chat.ws";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

const socketClient = new ChatSocketClient();

type ChatState = {
  contacts: ChatUser[];
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  isSocketConnected: boolean;
  message: string | null;
  error: string | null;

  fetchContacts: () => Promise<ChatUser[]>;
  fetchConversations: () => Promise<ChatConversation[]>;
  openConversationWith: (participantUserId: string) => Promise<ChatConversation>;
  setActiveConversation: (conversation: ChatConversation | null) => void;
  fetchMessages: (conversationId: string) => Promise<ChatMessage[]>;
  sendMessage: (payload: SendMessageRequest) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  clearError: () => void;
};

const upsertMessage = (messages: ChatMessage[], message: ChatMessage) => {
  if (messages.some((item) => item.id === message.id)) return messages;
  return [...messages, message].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
};

const upsertConversationLastMessage = (conversations: ChatConversation[], message: ChatMessage) =>
  conversations.map((conversation) =>
    conversation.id === message.conversation_id
      ? { ...conversation, last_message: message, updated_at: message.created_at }
      : conversation,
  );

export const useChatStore = create<ChatState>()((set, get) => ({
  contacts: [],
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  isSocketConnected: false,
  message: null,
  error: null,

  fetchContacts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatApi.listContacts();
      const contacts = unwrap(response, "Lay danh sach nguoi nhan tin that bai");
      set({ contacts, isLoading: false });
      return contacts;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay danh sach nguoi nhan tin that bai";
      set({ isLoading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  fetchConversations: async () => {
    try {
      const response = await chatApi.listConversations();
      const conversations = unwrap(response, "Lay danh sach hoi thoai that bai");
      set({ conversations });
      return conversations;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay danh sach hoi thoai that bai";
      set({ error: message });
      toast.error(message);
      throw error;
    }
  },

  openConversationWith: async (participantUserId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatApi.createConversation({ participant_user_id: participantUserId });
      const conversation = unwrap(response, "Mo hoi thoai that bai");
      const messages = await chatApi.listMessages(conversation.id, { limit: 50 });
      set((state) => ({
        activeConversation: conversation,
        conversations: state.conversations.some((item) => item.id === conversation.id)
          ? state.conversations.map((item) => (item.id === conversation.id ? conversation : item))
          : [conversation, ...state.conversations],
        messages: unwrap(messages, "Lay tin nhan that bai"),
        isLoading: false,
      }));
      return conversation;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Mo hoi thoai that bai";
      set({ isLoading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  setActiveConversation: (conversation) => set({ activeConversation: conversation, messages: [] }),

  fetchMessages: async (conversationId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatApi.listMessages(conversationId, { limit: 50 });
      const messages = unwrap(response, "Lay tin nhan that bai");
      set({ messages, isLoading: false });
      return messages;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay tin nhan that bai";
      set({ isLoading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  sendMessage: async (payload) => {
    try {
      set({ isSending: true, error: null });
      const sentBySocket = get().isSocketConnected && socketClient.sendMessage(payload);
      if (!sentBySocket) {
        const response = await chatApi.sendMessage(payload);
        const message = unwrap(response, "Gui tin nhan that bai");
        set((state) => ({
          messages:
            state.activeConversation?.id === message.conversation_id
              ? upsertMessage(state.messages, message)
              : state.messages,
          conversations: upsertConversationLastMessage(state.conversations, message),
        }));
      }
      set({ isSending: false, message: "Gui tin nhan thanh cong" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gui tin nhan that bai";
      set({ isSending: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  connectSocket: () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;
    socketClient.connect(
      token,
      (event: ChatSocketEvent) => {
        if (event.type === "connected") {
          set({ isSocketConnected: true });
          return;
        }
        if (event.type === "error") {
          set({ error: event.payload.message, isSending: false });
          toast.error(event.payload.message);
          return;
        }
        if (event.type === "message.new") {
          const message = event.payload;
          set((state) => ({
            messages:
              state.activeConversation?.id === message.conversation_id
                ? upsertMessage(state.messages, message)
                : state.messages,
            conversations: upsertConversationLastMessage(state.conversations, message),
            isSending: false,
          }));
          if (!get().conversations.some((item) => item.id === message.conversation_id)) {
            void get().fetchConversations();
          }
        }
      },
      () => set({ isSocketConnected: false }),
    );
  },

  disconnectSocket: () => {
    socketClient.disconnect();
    set({ isSocketConnected: false });
  },

  clearError: () => set({ error: null }),
}));
