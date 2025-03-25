
import { User, Message, Conversation } from '@/types/auth';
import { getLatestMessage } from '@/utils/authUtils';

export function useConversations(user: User | null, userMessages: Message[]) {
  // Handle case when userMessages is undefined
  if (!Array.isArray(userMessages)) {
    console.warn('useConversations received non-array userMessages:', userMessages);
    return [];
  }
  
  // Group messages into conversations
  const userConversations = user && userMessages && userMessages.length > 0 
    ? userMessages.reduce<Conversation[]>((conversations, message) => {
        // Skip null or undefined messages
        if (!message || !message.senderId) {
          return conversations;
        }

        const existingConversationIndex = conversations.findIndex(
          conv => conv.partnerId === message.senderId
        );

        if (existingConversationIndex >= 0) {
          const conversation = conversations[existingConversationIndex];
          const updatedMessages = [...conversation.messages, message];
          
          updatedMessages.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          conversations[existingConversationIndex] = {
            ...conversation,
            messages: updatedMessages,
            latestMessage: getLatestMessage(updatedMessages),
            unreadCount: updatedMessages.filter(msg => !msg.read).length,
            listingId: conversation.listingId || message.listingId,
            listingTitle: conversation.listingTitle || message.listingTitle
          };
        } else {
          conversations.push({
            partnerId: message.senderId,
            partnerName: message.senderName,
            messages: [message],
            latestMessage: message,
            unreadCount: message.read ? 0 : 1,
            listingId: message.listingId,
            listingTitle: message.listingTitle
          });
        }

        return conversations;
      }, []) 
    : [];

  // Sort conversations by most recent message first
  userConversations.sort((a, b) => 
    new Date(b.latestMessage.timestamp).getTime() - new Date(a.latestMessage.timestamp).getTime()
  );

  return userConversations;
}
