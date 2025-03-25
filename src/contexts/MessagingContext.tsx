
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Conversation, User, AuthContextType } from '@/types/auth';
import { loadMessagesFromLocalStorage, saveMessagesToLocalStorage } from '@/utils/authUtils';
import { useMessaging } from '@/hooks/use-messaging';
import { useConversations } from '@/hooks/use-conversations';
import { useSupabaseMessaging } from '@/hooks/use-supabase-messaging';

// Get the auth context without importing from AuthContext directly
// to avoid circular dependency issues
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Creating a separate context just for obtaining the auth context
// This avoids the circular dependency
const RawAuthContext = createContext<AuthContextValue | undefined>(undefined);

// Create our messaging context
const MessagingContext = createContext<Partial<AuthContextType> | undefined>(undefined);

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  // Get raw auth context from parent
  const authContext = useContext(RawAuthContext);
  
  if (!authContext) {
    console.warn('MessagingProvider: No auth context available, using default values');
  }
  
  // Use the values from auth context or provide defaults if not available
  const user = authContext?.user || null;
  const isAuthenticated = authContext?.isAuthenticated || false;
  const isLoading = authContext?.isLoading || false;
  
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  
  // Initialize messages from localStorage only if we're not using Supabase
  useEffect(() => {
    if (!isLoading) {
      try {
        const storedMessages = loadMessagesFromLocalStorage();
        if (Array.isArray(storedMessages)) {
          setAllMessages(storedMessages);
          console.log('Loaded messages from localStorage:', storedMessages.length);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setAllMessages([]);
      }
    }
  }, [isLoading]);
  
  // Use Supabase messaging for authenticated users
  const supabaseMessaging = useSupabaseMessaging(user?.id);
  
  // Use legacy messaging for non-authenticated users or as fallback
  const legacyMessaging = useMessaging(user, allMessages, setAllMessages);
  
  // Save local messages to localStorage whenever they change
  useEffect(() => {
    if (Array.isArray(allMessages)) {
      saveMessagesToLocalStorage(allMessages);
    }
  }, [allMessages]);
  
  // Filter messages for the current user - ensure we have valid data
  const userMessages = isAuthenticated && user && supabaseMessaging.messages ? 
    supabaseMessaging.messages : 
    (isAuthenticated && user && Array.isArray(allMessages) ? 
      allMessages.filter(msg => msg && msg.receiverId === user.id) : 
      []);

  // Get conversations based on user messages
  const userConversations = isAuthenticated && user && supabaseMessaging.conversations ? 
    supabaseMessaging.conversations : 
    useConversations(user, userMessages);

  console.log("Current user:", user?.id);
  console.log("Auth initialized:", !isLoading);
  console.log("Using Supabase messaging:", isAuthenticated);
  console.log("Supabase messages:", supabaseMessaging.messages ? supabaseMessaging.messages.length : 0);
  console.log("Local messages:", allMessages ? allMessages.length : 0);
  console.log("Filtered messages for user:", userMessages ? userMessages.length : 0);
  console.log("Grouped conversations:", userConversations ? userConversations.length : 0);
  
  // Wrapper functions to handle the async operations correctly
  const handleSendMessage = async (
    receiverId: string, 
    message: string, 
    listingId?: string,
    listingTitle?: string
  ): Promise<boolean> => {
    if (isAuthenticated) {
      try {
        await supabaseMessaging.sendMessage(receiverId, message, listingId, listingTitle);
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    } else {
      return legacyMessaging.sendMessage(receiverId, message, listingId, listingTitle);
    }
  };

  const handleMarkMessageAsRead = async (messageId: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseMessaging.markMessageAsRead(messageId);
    } else {
      legacyMessaging.markMessageAsRead(messageId);
    }
  };

  const handleDeleteMessage = async (messageId: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseMessaging.deleteMessage(messageId);
    } else {
      legacyMessaging.deleteMessage(messageId);
    }
  };

  const handleDeleteConversation = async (partnerId: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseMessaging.deleteConversation(partnerId);
    } else {
      legacyMessaging.deleteConversation(partnerId);
    }
  };
  
  // Create context value with messaging functions
  const messagingContextValue = {
    userMessages,
    userConversations,
    sendMessage: handleSendMessage,
    markMessageAsRead: handleMarkMessageAsRead,
    deleteMessage: handleDeleteMessage,
    deleteConversation: handleDeleteConversation
  };
  
  return (
    <MessagingContext.Provider value={messagingContextValue}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessagingContext = () => {
  const context = useContext(MessagingContext);
  
  if (context === undefined) {
    throw new Error('useMessagingContext must be used within a MessagingProvider');
  }
  
  return context;
};

// Export the RawAuthContext provider for use in AuthContext
export { RawAuthContext };
