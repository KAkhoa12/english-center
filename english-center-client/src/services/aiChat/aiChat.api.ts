import { useAuthStore } from "@/services/auth/auth.store";
import type { AiChatStreamRequest } from "./aiChat.type";

type StreamCallbacks = {
  onToken: (token: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
};

const parseSseChunk = (chunk: string, callbacks: StreamCallbacks) => {
  const events = chunk.split("\n\n");
  for (const event of events) {
    if (!event.trim()) continue;
    const eventType = event.split("\n").find((line) => line.startsWith("event:"))?.replace("event:", "").trim();
    const dataLines = event
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s?/, ""));
    const data = dataLines.join("\n");
    if (eventType === "done" || data === "[DONE]") callbacks.onDone?.();
    else if (eventType === "error") callbacks.onError?.(data || "Chat AI bi loi");
    else callbacks.onToken(data.replace(/\\n/g, "\n"));
  }
};

export const aiChatApi = {
  streamChat: async (payload: AiChatStreamRequest, callbacks: StreamCallbacks) => {
    const token = useAuthStore.getState().accessToken;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      throw new Error("Khong ket noi duoc Chat AI");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lastSeparator = buffer.lastIndexOf("\n\n");
      if (lastSeparator === -1) continue;
      const complete = buffer.slice(0, lastSeparator + 2);
      buffer = buffer.slice(lastSeparator + 2);
      parseSseChunk(complete, callbacks);
    }

    if (buffer.trim()) parseSseChunk(buffer, callbacks);
    callbacks.onDone?.();
  },
};
