
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Heart,
  Share,
  MessageCircle,
  Check,
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
  Clock,
  AlertCircle,
} from 'lucide-react';

// Demo product data
const productData = {
  id: 1,
  title: 'Introduction to Economics Textbook',
  price: 75.00,
  images: [
    'https://picsum.photos/id/24/800/600',
    'https://picsum.photos/id/25/800/600',
    'https://picsum.photos/id/26/800/600',
    'https://picsum.photos/id/27/800/600',
  ],
  category: 'Textbooks',
  condition: 'Like New',
  description: `This is the official textbook for ECO101 and ECO102 at UofT. 
                7th Edition (newest version), with minimal highlighting in the first few chapters only. 
                Includes access code for online materials (unused). 
                Perfect for anyone taking Introduction to Economics in the upcoming semester. 
                Originally purchased for $150 from the campus bookstore.`,
  seller: {
    id: 101,
    name: 'Alex Kim',
    verified: true,
    joined: 'August 2022',
    major: 'Economics',
    responseRate: '95%',
    responseTime: 'Within 2 hours',
    listings: 12,
    rating: 4.8,
    avatar: 'https://picsum.photos/id/64/100/100'
  },
  postedTime: '2 days ago',
  location: 'St. George Campus',
  specifications: {
    'Author': 'Mankiw, N. Gregory',
    'Edition': '7th Edition',
    'ISBN': '978-1337091992',
    'Course': 'ECO101/ECO102',
    'Includes': 'Online Access Code',
    'Pages': '836',
    'Publisher': 'Cengage Learning'
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(productData);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "This item has been removed from your saved items" 
        : "This item has been added to your saved items",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Product link has been copied to your clipboard",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the seller",
    });
    setMessageText('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="loading-shimmer w-16 h-16 rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" className="px-0" asChild>
              <Link to="/products" className="flex items-center space-x-1 text-gray-600 hover:text-toronto-blue">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to listings</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-soft">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.title} 
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`bg-white rounded-md overflow-hidden border border-gray-100 
                    ${selectedImage === index ? 'ring-2 ring-toronto-blue' : 'opacity-80 hover:opacity-100'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className="w-full h-auto aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold">{product.title}</h1>
                  <span className="text-2xl font-bold text-toronto-blue">${product.price.toFixed(2)}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-toronto-blue/10 text-toronto-blue hover:bg-toronto-blue/20 hover:text-toronto-blue">
                    {product.category}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{product.condition}</Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{product.postedTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={handleFavorite}>
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button className="flex-1 bg-toronto-blue hover:bg-toronto-blue/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="seller">Seller</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                </TabsContent>
                
                <TabsContent value="specifications" className="pt-6">
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-2">
                        <Tag className="h-4 w-4 text-toronto-blue mt-0.5" />
                        <div>
                          <span className="text-gray-600 font-medium">{key}:</span>{" "}
                          <span className="text-gray-800">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="seller" className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                      {product.seller.avatar ? (
                        <img src={product.seller.avatar} alt={product.seller.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-toronto-blue text-white text-xl font-bold">
                          {product.seller.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{product.seller.name}</h3>
                        {product.seller.verified && (
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Joined {product.seller.joined}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>Major: {product.seller.major}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MessageCircle className="h-4 w-4 text-gray-500" />
                          <span>Response rate: {product.seller.responseRate}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Typically responds {product.seller.responseTime}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{product.seller.listings}</span> active listings · 
                          <span className="font-medium"> {product.seller.rating}</span>/5 rating
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-3">Contact Seller</h4>
                    <form onSubmit={handleSendMessage}>
                      <Textarea 
                        placeholder="Hi! I'm interested in your listing. Is it still available?" 
                        className="mb-3" 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={4}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Only contact for legitimate inquiries</span>
                        </div>
                        <Button type="submit" className="bg-toronto-blue hover:bg-toronto-blue/90">
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Component for GraduationCap icon
const GraduationCap = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
};

export default ProductDetail;
