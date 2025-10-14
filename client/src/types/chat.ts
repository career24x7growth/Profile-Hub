export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Conversation {
  _id: string;
  type: "direct" | "group";
  name?: string;
  participants: User[];
  createdBy: string;
  lastMessage?: {
    content: string;
    sender: User;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  isDeleted: boolean;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
}
