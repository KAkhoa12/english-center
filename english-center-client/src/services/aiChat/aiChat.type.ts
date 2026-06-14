export type AiChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

export type AiChatStreamRequest = {
  message: string;
  context?: "home" | "dashboard" | string;
};
