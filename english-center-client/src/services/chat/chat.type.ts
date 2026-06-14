export type ChatUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  roles: string[];
  contact_type?: string | null;
  class_ids: string[];
};

export type ChatAttachmentPayload = {
  bucket: string;
  object_name: string;
  original_filename?: string | null;
  content_type?: string | null;
  size?: number | null;
  url?: string | null;
};

export type ChatAttachment = ChatAttachmentPayload & {
  id: string;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string | null;
  message_type: "text" | "file" | "image" | "mixed";
  attachments: ChatAttachment[];
  created_at: string;
};

export type ChatConversation = {
  id: string;
  type: "direct";
  title?: string | null;
  participants: ChatUser[];
  last_message?: ChatMessage | null;
  created_at: string;
  updated_at: string;
};

export type CreateConversationRequest = {
  participant_user_id: string;
};

export type SendMessageRequest = {
  conversation_id?: string | null;
  recipient_user_id?: string | null;
  content?: string | null;
  attachments?: ChatAttachmentPayload[];
};

export type ChatSocketEvent =
  | { type: "connected"; payload: { user_id: string } }
  | { type: "message.new"; payload: ChatMessage }
  | { type: "error"; payload: { message: string } };
