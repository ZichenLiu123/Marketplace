import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, Shield, GraduationCap, CalendarDays } from "lucide-react";
import { useListings } from "@/contexts/ListingsContext";
import { formatDistanceToNow } from "date-fns";
import ProductCard from "@/components/ProductCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer: string;
  date: string;
}

interface SellerProfileProps {
  seller: string;
  isOpen: boolean;
  onClose: () => void;
}

const SellerProfile = ({ seller, isOpen, onClose }: SellerProfileProps) => {
  const { getSellerListings } = useListings();
  const { user } = useAuth();
  const { toast } = useToast();
  const sellerListings = getSellerListings(seller);
  const [activeTab, setActiveTab] = useState<"listings" | "reviews">("listings");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasInteractedWithSeller, setHasInteractedWithSeller] = useState(false);
  const [sellerUserData, setSellerUserData] = useState<any>(null);
  const [isLoadingSellerData, setIsLoadingSellerData] = useState(true);
  
  // Seller data with dynamic review count
  const [sellerData, setSellerData] = useState({
    name: seller,
    joinedDate: "2023-01-15",
    location: "University of Toronto",
    rating: 0,
    reviewCount: 0,
    verified: true
  });
  
  // Fetch seller profile data
  useEffect(() => {
    const fetchSellerData = async () => {
      setIsLoadingSellerData(true);
      
      try {
        if (isSupabaseConfigured()) {
          // Get the seller's profile from the profiles table
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', seller)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching seller profile:", error);
          }
          
          if (profileData) {
            console.log("Found seller profile:", profileData);
            setSellerUserData(profileData);
          } else {
            console.log("No profile found for seller:", seller);
            // Fallback to mock data if no profile is found
            setSellerUserData({
              program: "Not specified",
              year: "Not specified",
              bio: "No bio available.",
              hasCompletedSetup: true
            });
          }
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        // Fallback to mock data on error
        setSellerUserData({
          program: "Not specified",
          year: "Not specified",
          bio: "No bio available.",
          hasCompletedSetup: true
        });
      } finally {
        setIsLoadingSellerData(false);
      }
    };
    
    if (isOpen) {
      fetchSellerData();
    }
  }, [seller, isOpen]);
  
  // Load reviews
  useEffect(() => {
    // In a real app, this would be an API call to fetch reviews
    // For this example, we'll use mock data
    const mockReviews: Review[] = [
      {
        id: "1",
        rating: 5,
        comment: "Great seller! Item was exactly as described and they were very prompt with communication.",
        reviewer: "John D.",
        date: "2023-09-15"
      },
      {
        id: "2",
        rating: 4,
        comment: "Textbook was in good condition as promised. Would buy from again.",
        reviewer: "Sarah M.",
        date: "2023-08-22"
      },
      {
        id: "3",
        rating: 5,
        comment: "Excellent service and the item arrived in perfect condition.",
        reviewer: "Mike T.",
        date: "2023-07-15"
      },
      {
        id: "4",
        rating: 5,
        comment: "Amazing seller! Would definitely recommend to others.",
        reviewer: "Lisa P.",
        date: "2023-06-30"
      },
      {
        id: "5",
        rating: 4,
        comment: "Good communication and fair pricing.",
        reviewer: "David K.",
        date: "2023-06-15"
      }
    ];
    
    setReviews(mockReviews);
    
    // Calculate average rating
    const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = mockReviews.length > 0 ? totalRating / mockReviews.length : 0;
    
    setSellerData(prev => ({
      ...prev,
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: mockReviews.length
    }));
    
    // Check if the current user has interacted with this seller
    // In a real app, this would check transaction history
    // For now, we'll enable it for demo purposes if the user is logged in
    if (user) {
      setHasInteractedWithSeller(true);
    }
  }, [seller, user]);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };
  
  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to rate this seller.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new review
    const newReview: Review = {
      id: `review-${Date.now()}`,
      rating: userRating,
      comment: ratingComment,
      reviewer: user.name || user.email.split('@')[0],
      date: new Date().toISOString()
    };
    
    // Add the review to the list
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    
    // Recalculate average rating
    const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
    
    setSellerData(prev => ({
      ...prev,
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: updatedReviews.length
    }));
    
    toast({
      title: "Rating submitted!",
      description: "Thank you for rating this seller.",
    });
    
    setShowRatingForm(false);
    setUserRating(0);
    setRatingComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seller Profile</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Seller Info */}
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
              {seller.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{sellerData.name}</h2>
              
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Member {formatJoinDate(sellerData.joinedDate)}</span>
              </div>
              
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{sellerData.location}</span>
              </div>
              
              {/* Education info */}
              {sellerUserData && (
                <>
                  {sellerUserData.program && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      <span>Program: {sellerUserData.program}</span>
                    </div>
                  )}
                  
                  {sellerUserData.year && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      <span>Year: {sellerUserData.year}</span>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4" 
                      fill={i < Math.floor(sellerData.rating) ? "gold" : "none"} 
                      stroke={i < Math.floor(sellerData.rating) ? "gold" : "currentColor"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">{sellerData.rating} ({sellerData.reviewCount} reviews)</span>
              </div>
              
              {sellerData.verified && (
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified UofT Seller
                </div>
              )}
            </div>
          </div>
          
          {/* Seller Bio */}
          {sellerUserData && sellerUserData.bio && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">About Me</h3>
              <p className="text-sm text-gray-700">{sellerUserData.bio}</p>
            </div>
          )}
          
          <Separator className="my-6" />
          
          {/* Tabs for Listings and Reviews */}
          <div className="flex space-x-2 mb-6">
            <Button 
              variant={activeTab === "listings" ? "default" : "outline"}
              onClick={() => setActiveTab("listings")}
            >
              Listings ({sellerListings.length})
            </Button>
            <Button 
              variant={activeTab === "reviews" ? "default" : "outline"}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </Button>
          </div>
          
          {/* Tab Content */}
          {activeTab === "listings" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Seller's Listings</h3>
              
              {sellerListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sellerListings.map((listing) => (
                    <ProductCard 
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      image={listing.image}
                      seller={listing.seller}
                      category={listing.category || "miscellaneous"}
                      condition={listing.condition || "Not specified"}
                      postedTime={listing.postedTime}
                      location={listing.location || "University of Toronto"}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">This seller has no active listings.</p>
              )}
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Reviews ({reviews.length})</h3>
                {hasInteractedWithSeller && !showRatingForm && user && (
                  <Button onClick={() => setShowRatingForm(true)}>Rate this Seller</Button>
                )}
                {!user && (
                  <Button onClick={() => toast({
                    title: "Authentication required",
                    description: "Please sign in to rate sellers.",
                    variant: "destructive"
                  })}>
                    Rate this Seller
                  </Button>
                )}
              </div>
              
              {/* Rating Form */}
              {showRatingForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2">Rate Your Experience</h4>
                  
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star 
                        key={rating}
                        className="w-6 h-6 cursor-pointer mr-1"
                        onClick={() => setUserRating(rating)}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(0)}
                        fill={(hoveredRating || userRating) >= rating ? "gold" : "none"}
                        stroke={(hoveredRating || userRating) >= rating ? "gold" : "currentColor"}
                      />
                    ))}
                  </div>
                  
                  <Textarea 
                    placeholder="Share your experience with this seller..." 
                    className="mb-3"
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRatingForm(false)}>Cancel</Button>
                    <Button onClick={handleRatingSubmit}>Submit Rating</Button>
                  </div>
                </div>
              )}
              
              {/* Reviews List */}
              <div className="space-y-4">
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-4 h-4" 
                              fill={i < review.rating ? "gold" : "none"} 
                              stroke={i < review.rating ? "gold" : "currentColor"}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium">{formatDistanceToNow(new Date(review.date), { addSuffix: true })}</span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">by {review.reviewer}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">This seller has no reviews yet.</p>
                )}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerProfile;
