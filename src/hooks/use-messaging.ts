
import { toast } from "sonner";
import { User, Message } from '@/types/auth';
import { saveMessagesToLocalStorage } from '@/utils/authUtils';

export function useMessaging(
  user: User | null,
  allMessages: Message[],
  setAllMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  // Ensure allMessages is always an array
  const safeMessages = Array.isArray(allMessages) ? allMessages : [];
  
  const sendMessage = async (
    sellerId: string, 
    message: string, 
    listingId?: string, 
    listingTitle?: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please sign in to message sellers."
      });
      return false;
    }
    
    if (!message.trim()) {
      toast.error("Empty Message", {
        description: "Please enter a message to send."
      });
      return false;
    }
    
    try {
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderId: user.id,
        senderName: user.name,
        receiverId: sellerId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        listingId,
        listingTitle
      };

      setAllMessages(prev => {
        // Ensure prev is an array
        const safeArray = Array.isArray(prev) ? prev : [];
        const updatedMessages = [...safeArray, newMessage];
        saveMessagesToLocalStorage(updatedMessages);
        return updatedMessages;
      });
      
      toast.success("Message Sent", {
        description: "Your message has been sent to the seller."
      });
      
      return true;
    } catch (error) {
      console.error('Message sending error:', error);
      toast.error("Message Error", {
        description: "An error occurred while sending your message."
      });
      return false;
    }
  };
  
  const markMessageAsRead = (messageId: string) => {
    setAllMessages(prev => {
      // Ensure prev is an array
      const safeArray = Array.isArray(prev) ? prev : [];
      const updatedMessages = safeArray.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      saveMessagesToLocalStorage(updatedMessages);
      return updatedMessages;
    });
  };

  const deleteMessage = (messageId: string) => {
    setAllMessages(prev => {
      // Ensure prev is an array
      const safeArray = Array.isArray(prev) ? prev : [];
      const updatedMessages = safeArray.filter(msg => msg.id !== messageId);
      saveMessagesToLocalStorage(updatedMessages);
      return updatedMessages;
    });
  };

  const deleteConversation = (partnerId: string) => {
    if (!user) return;
    
    setAllMessages(prev => {
      // Ensure prev is an array
      const safeArray = Array.isArray(prev) ? prev : [];
      const updatedMessages = safeArray.filter(msg => 
        !(msg.senderId === partnerId && msg.receiverId === user.id) && 
        !(msg.senderId === user.id && msg.receiverId === partnerId)
      );
      saveMessagesToLocalStorage(updatedMessages);
      return updatedMessages;
    });
    
    toast.success("Conversation Deleted", {
      description: "The conversation has been removed."
    });
  };

  return {
    sendMessage,
    markMessageAsRead,
    deleteMessage,
    deleteConversation
  };
}
