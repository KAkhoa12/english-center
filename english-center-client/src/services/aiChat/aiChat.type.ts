export type AiChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

export type AiChatStreamRequest = {
  message: string;
  context?: "home" | "dashboard" | string;
  session_id: string;
  client_message_id?: string;
};

export type AiChatSessionResponse = {
  session_id: string;
};
