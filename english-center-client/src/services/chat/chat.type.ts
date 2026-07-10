export type ChatUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  roles: string[];
  contact_type?: string | null;
  class_ids: string[];
  participant_role?: "consultant" | "customer" | "teacher" | "student" | null;
  joined_at?: string | null;
  left_at?: string | null;
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
  reply_to_message_id?: string | null;
  reply_to_message?: {
    id: string;
    sender_id: string;
    content?: string | null;
    created_at: string;
  } | null;
  is_read: boolean;
  read_at?: string | null;
  attachments: ChatAttachment[];
  created_at: string;
};

export type ChatConversation = {
  id: string;
  type: "direct_consultation" | "direct_learning" | "class_group";
  title?: string | null;
  consultation_id?: string | null;
  class_id?: string | null;
  participants: ChatUser[];
  last_message?: ChatMessage | null;
  created_at: string;
  updated_at: string;
};

export type CreateConversationRequest = {
  conversation_type?: "direct_consultation" | "direct_learning" | "class_group" | null;
  participant_user_id?: string | null;
  consultation_id?: string | null;
  class_id?: string | null;
};

export type SendMessageRequest = {
  conversation_id?: string | null;
  recipient_user_id?: string | null;
  content?: string | null;
  reply_to_message_id?: string | null;
  attachments?: ChatAttachmentPayload[];
};

export type ChatSocketEvent =
  | { type: "connected"; payload: { user_id: string } }
  | { type: "message.new"; payload: ChatMessage }
  | { type: "error"; payload: { message: string } };
