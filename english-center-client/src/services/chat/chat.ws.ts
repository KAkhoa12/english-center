import type { ChatSocketEvent, SendMessageRequest } from "./chat.type";

const toWebSocketUrl = (apiUrl: string, token: string) => {
  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(/\/$/, "")}/ws/chat`;
  url.searchParams.set("token", token);
  return url.toString();
};

export class ChatSocketClient {
  private socket: WebSocket | null = null;

  connect(token: string, onEvent: (event: ChatSocketEvent) => void, onClose?: () => void) {
    this.disconnect();
    this.socket = new WebSocket(toWebSocketUrl(import.meta.env.VITE_API_URL, token));
    this.socket.onmessage = (event) => {
      try {
        onEvent(JSON.parse(event.data) as ChatSocketEvent);
      } catch {
        onEvent({ type: "error", payload: { message: "Khong doc duoc du lieu socket" } });
      }
    };
    this.socket.onclose = () => onClose?.();
    this.socket.onerror = () => onEvent({ type: "error", payload: { message: "Ket noi tin nhan bi gian doan" } });
  }

  sendMessage(payload: SendMessageRequest) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify({ type: "message.send", payload }));
    return true;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
