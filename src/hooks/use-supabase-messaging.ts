
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types/auth';

export const useSupabaseMessaging = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load messages
  const loadMessages = async () => {
    if (!userId) {
      console.error('Cannot load messages: No user ID provided');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching messages for user:', userId);
      
      // Fetch messages directly from the messages table
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        throw messagesError;
      }
      
      console.log('Raw messages data from Supabase:', messagesData);
      
      if (!messagesData) {
        console.log('No messages found');
        setMessages([]);
        setConversations([]);
        return;
      }
      
      // Convert from Supabase format to app format
      const convertedMessages: Message[] = await Promise.all(messagesData.map(async (msg) => {
        // Get sender name if not the current user
        let senderName = '';
        if (msg.sender_id !== userId) {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', msg.sender_id)
            .single();
          
          senderName = senderData?.name || 'Unknown User';
        } else {
          const { data: currentUserData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', userId)
            .single();
          
          senderName = currentUserData?.name || 'You';
        }
        
        return {
          id: msg.id,
          senderId: msg.sender_id,
          senderName: senderName,
          receiverId: msg.receiver_id,
          message: msg.message,
          timestamp: msg.created_at,
          read: msg.read,
          listingId: msg.listing_id,
          listingTitle: msg.listing_title
        };
      }));
      
      console.log('Converted messages:', convertedMessages);
      setMessages(convertedMessages);
      
      // Process conversations
      processConversations(convertedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err as Error);
      toast.error("Failed to load messages", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Process conversations from messages
  const processConversations = (msgs: Message[]) => {
    if (!userId || !Array.isArray(msgs)) {
      console.error('Cannot process conversations: Invalid data', { userId, messagesLength: msgs?.length });
      return;
    }
    
    console.log('Processing conversations for user:', userId, 'with messages:', msgs.length);
    
    const conversationMap = new Map<string, Conversation>();
    
    msgs.forEach(msg => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partnerName = msg.senderId === userId ? 'Unknown User' : msg.senderName; 
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          partnerName,
          messages: [],
          latestMessage: msg,
          unreadCount: msg.senderId !== userId && !msg.read ? 1 : 0,
          listingId: msg.listingId,
          listingTitle: msg.listingTitle
        });
      }
      
      const conversation = conversationMap.get(partnerId)!;
      conversation.messages.push(msg);
      
      // Update latest message if this one is newer
      if (new Date(msg.timestamp) > new Date(conversation.latestMessage.timestamp)) {
        conversation.latestMessage = msg;
      }
      
      // Update partner name if available
      if (msg.senderId !== userId && msg.senderName && msg.senderName !== 'Unknown User') {
        conversation.partnerName = msg.senderName;
      }
      
      // Update unread count
      if (msg.senderId !== userId && !msg.read) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    });
    
    const conversationsArray = Array.from(conversationMap.values());
    console.log('Processed conversations:', conversationsArray);
    setConversations(conversationsArray);
  };
  
  // Send a message
  const sendMessage = async (
    receiverId: string, 
    message: string, 
    listingId?: string,
    listingTitle?: string
  ): Promise<boolean> => {
    if (!userId) {
      console.error('Cannot send message: No user ID provided');
      toast.error("Authentication required", {
        description: "Please sign in to send messages"
      });
      return false;
    }
    
    if (!message.trim()) {
      toast.error("Cannot send empty message");
      return false;
    }
    
    console.log('Sending message:', { 
      senderId: userId, 
      receiverId, 
      messageContent: message, 
      listingId, 
      listingTitle 
    });
    
    try {
      // Insert the new message directly into the Supabase database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          message: message.trim(),
          listing_id: listingId,
          listing_title: listingTitle,
          read: false
        })
        .select();
      
      if (error) {
        console.error('Error sending message to Supabase:', error);
        toast.error("Failed to send message", {
          description: error.message
        });
        return false;
      }
      
      console.log('Message successfully sent, response:', data);
      
      // Reload messages to get the new one
      await loadMessages();
      
      toast.success("Message sent successfully");
      return true;
    } catch (err) {
      console.error('Error in sendMessage:', err);
      toast.error("Failed to send message", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  // Mark message as read
  const markMessageAsRead = async (messageId: string): Promise<boolean> => {
    if (!userId) return false;
    
    console.log('Marking message as read:', messageId);
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      if (error) {
        console.error('Error marking message as read:', error);
        return false;
      }
      
      console.log('Message marked as read successfully');
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      // Update conversation unread counts
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          const updatedMessages = conv.messages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          );
          
          const unreadCount = updatedMessages.filter(
            msg => msg.senderId !== userId && !msg.read
          ).length;
          
          return {
            ...conv,
            messages: updatedMessages,
            unreadCount
          };
        })
      );
      
      return true;
    } catch (err) {
      console.error('Error in markMessageAsRead:', err);
      return false;
    }
  };
  
  // Delete message
  const deleteMessage = async (messageId: string): Promise<boolean> => {
    if (!userId) return false;
    
    console.log('Deleting message:', messageId);
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
      
      if (error) {
        console.error('Error deleting message:', error);
        return false;
      }
      
      console.log('Message deleted successfully');
      
      // Update local state
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      
      // Update conversations
      setConversations(prevConversations => 
        prevConversations.map(conv => ({
          ...conv,
          messages: conv.messages.filter(msg => msg.id !== messageId),
          unreadCount: conv.messages.filter(msg => 
            msg.id !== messageId && msg.senderId !== userId && !msg.read
          ).length
        }))
      );
      
      return true;
    } catch (err) {
      console.error('Error in deleteMessage:', err);
      return false;
    }
  };
  
  // Delete conversation
  const deleteConversation = async (partnerId: string): Promise<boolean> => {
    if (!userId) return false;
    
    console.log('Deleting conversation with partner:', partnerId);
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),` +
          `and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`
        );
      
      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }
      
      console.log('Conversation deleted successfully');
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.filter(msg => 
          !(msg.senderId === userId && msg.receiverId === partnerId) && 
          !(msg.senderId === partnerId && msg.receiverId === userId)
        )
      );
      
      // Remove conversation
      setConversations(prevConversations => 
        prevConversations.filter(conv => conv.partnerId !== partnerId)
      );
      
      return true;
    } catch (err) {
      console.error('Error in deleteConversation:', err);
      return false;
    }
  };
  
  // Set up realtime subscription for messaging
  useEffect(() => {
    if (!userId) {
      console.log('No user ID, skipping subscription setup');
      return;
    }
    
    console.log('Setting up realtime subscription for user:', userId);
    
    // Initial load
    loadMessages();
    
    const channel = supabase
      .channel('messaging_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Message change received:', payload);
          // Reload messages when there's a change
          loadMessages();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    
    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  return {
    messages,
    conversations,
    loading,
    error,
    sendMessage,
    markMessageAsRead,
    deleteMessage,
    deleteConversation,
    refreshMessages: loadMessages
  };
};
