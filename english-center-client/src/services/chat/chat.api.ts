import { apiClient } from "@/config/api-client";

import type {
  ChatConversation,
  ChatMessage,
  ChatUser,
  CreateConversationRequest,
  SendMessageRequest,
} from "./chat.type";

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const chatApi = {
  listContacts: () => apiClient.get<ChatUser[]>("/chat/contacts"),

  listConversations: () => apiClient.get<ChatConversation[]>("/chat/conversations"),

  createConversation: (data: CreateConversationRequest) =>
    apiClient.post<ChatConversation, CreateConversationRequest>("/chat/conversations", data),

  listMessages: (conversationId: string, query?: { limit?: number; before_id?: string | null }) =>
    apiClient.get<ChatMessage[]>(appendQuery(`/chat/conversations/${conversationId}/messages`, query)),

  sendMessage: (data: SendMessageRequest) =>
    apiClient.post<ChatMessage, SendMessageRequest>("/chat/messages", data),
};
