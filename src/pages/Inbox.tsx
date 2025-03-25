import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle, Mail, CheckCheck, Clock, MessageSquare, Calendar, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useListings } from "@/contexts/ListingsContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Inbox = () => {
  const { user, userConversations, markMessageAsRead, sendMessage, deleteMessage } = useAuth();
  const { getUserListings } = useListings();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const userListings = getUserListings();
  
  // Calculate unread count safely
  const unreadCount = Array.isArray(userConversations) 
    ? userConversations.reduce((count, conv) => count + (conv.unreadCount || 0), 0)
    : 0;
  
  const openConversation = (partnerId: string) => {
    setSelectedConversation(partnerId);
    
    const conversation = userConversations.find(conv => conv.partnerId === partnerId);
    if (conversation) {
      // Mark unread messages as read
      conversation.messages.forEach(msg => {
        if (!msg.read && msg.senderId !== user?.id) {
          console.log("Marking message as read:", msg.id);
          markMessageAsRead(msg.id);
        }
      });
    } else {
      console.warn("Couldn't find conversation with partner", partnerId);
    }
    
    setReplyText("");
  };
  
  const closeConversation = () => {
    setSelectedConversation(null);
    setReplyText("");
  };

  const confirmDelete = (messageId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      try {
        await deleteMessage(messageToDelete);
        
        toast.success("Message deleted", {
          description: "The message has been removed from your conversation."
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message", {
          description: "Please try again later."
        });
      }
      
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
      
      const currentConversation = userConversations.find(
        conv => conv.partnerId === selectedConversation
      );
      
      if (!currentConversation || currentConversation.messages.length === 0) {
        closeConversation();
      }
    }
  };
  
  const currentConversation = userConversations.find(
    conv => conv.partnerId === selectedConversation
  );
  
  const handleSendReply = async () => {
    if (!currentConversation || !replyText.trim()) {
      toast.error("Cannot send empty message");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }
    
    setSendingMessage(true);
    
    try {
      console.log("Sending message to:", currentConversation.partnerId);
      
      await sendMessage(
        currentConversation.partnerId,
        replyText,
        currentConversation.listingId,
        currentConversation.listingTitle
      );
      
      toast.success("Reply sent successfully");
      setReplyText("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending your message");
    } finally {
      setSendingMessage(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Recently';
    }
  };

  console.log("User conversations in inbox:", userConversations);
  console.log("User has listings:", userListings.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Inbox</h1>
                <p className="text-gray-500">
                  Conversations with other users about your listings
                </p>
              </div>
              
              {unreadCount > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            
            {!Array.isArray(userConversations) || userConversations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <Mail className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Conversations Yet</h3>
                  <p className="text-gray-500 mb-4">
                    When people contact you about your listings, conversations will appear here.
                  </p>
                  {userListings.length === 0 ? (
                    <Button asChild>
                      <Link to="/sell">Create a Listing</Link>
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      You have {userListings.length} active {userListings.length === 1 ? 'listing' : 'listings'}. Messages will appear here when buyers contact you.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userConversations.map((conversation) => (
                  <Card 
                    key={conversation.partnerId} 
                    className={`hover:shadow-md transition-shadow cursor-pointer ${conversation.unreadCount > 0 ? 'border-l-4 border-l-blue-500' : ''}`}
                    onClick={() => openConversation(conversation.partnerId)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            {conversation.partnerName || "Unknown User"}
                            {conversation.unreadCount > 0 && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {conversation.unreadCount} new
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{conversation.latestMessage ? formatDate(conversation.latestMessage.timestamp) : 'Recently'}</span>
                          </CardDescription>
                        </div>
                        {conversation.listingTitle && (
                          <Badge variant="outline" className="text-xs">
                            {conversation.listingTitle}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        Latest: {conversation.latestMessage ? conversation.latestMessage.message : 'No messages yet'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialogOpen(true);
                          setMessageToDelete(conversation.latestMessage ? conversation.latestMessage.id : null);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConversation(conversation.partnerId);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {conversation.unreadCount > 0 ? "Read Messages" : "View Conversation"} 
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {currentConversation && (
              <Dialog open={!!selectedConversation} onOpenChange={(open) => !open && closeConversation()}>
                <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Conversation with {currentConversation.partnerName || "Unknown User"}</span>
                    </DialogTitle>
                    <DialogDescription>
                      {currentConversation.listingTitle && (
                        <Badge variant="outline" className="mt-1">
                          Re: {currentConversation.listingTitle}
                        </Badge>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-grow overflow-y-auto my-4 space-y-4 max-h-[40vh] min-h-[200px] p-2">
                    {Array.isArray(currentConversation.messages) && currentConversation.messages.length > 0 ? (
                      currentConversation.messages.map((message) => (
                        <div key={message.id} className="flex flex-col">
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-sm font-medium">
                              {message.senderId === user?.id ? "You" : message.senderName || "Unknown User"}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                          </div>
                          <div className={`p-3 rounded-md ${message.senderId === user?.id ? 'bg-blue-50 ml-auto' : 'bg-gray-50'}`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <div className="flex justify-end mt-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-6 text-xs px-2"
                              onClick={() => confirmDelete(message.id)}
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No messages in this conversation yet.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <h4 className="text-sm font-medium">Reply to {currentConversation.partnerName || "User"}</h4>
                    <Textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={3}
                    />
                  </div>
                  
                  <DialogFooter className="sm:justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={closeConversation}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" /> 
                        Back
                      </Button>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sendingMessage}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" /> 
                      {sendingMessage ? "Sending..." : "Send Reply"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteMessage}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Inbox;
