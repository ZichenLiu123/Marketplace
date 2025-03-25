
export interface UserProfile {
  name: string;
  program?: string;
  year?: string;
  bio?: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  program?: string;
  year?: string;
  bio?: string;
  phone?: string;
}

export interface ProfileData {
  program: string;
  year: string;
  bio?: string;
  phone?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
  listingId?: string;
  listingTitle?: string;
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  messages: Message[];
  latestMessage: Message;
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUpdatingProfile: boolean;
  sessionExpiryTime: Date | null;
  refreshSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, profileData?: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: any) => Promise<boolean>;
  // Messaging-related properties
  userMessages: Message[];
  userConversations: Conversation[];
  sendMessage: (receiverId: string, message: string, listingId?: string, listingTitle?: string) => Promise<boolean>;
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  deleteConversation: (partnerId: string) => void;
}
