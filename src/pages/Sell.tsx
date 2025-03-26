import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useListings } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImagePreservingFormat } from "@/utils/imageUtils";
import ImageUpload from "@/components/ImageUpload";
import SupabaseStorageTest from "@/components/SupabaseStorageTest";
import StoragePolicyFixer from "@/components/StoragePolicyFixer";
const Sell = () => {
  const navigate = useNavigate();
  const {
    addListing
  } = useListings();
  const {
    user
  } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<{
    file: File;
    preview: string;
  }[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [shipping, setShipping] = useState(false);
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };
  const uploadImages = async () => {
    if (!user || images.length === 0) return [];
    setUploadingImages(true);
    const uploadedImageUrls: string[] = [];
    try {
      console.log('Starting image upload process for', images.length, 'images');
      if (!user.id) {
        console.error('User ID is missing, cannot upload images');
        toast.error("Authentication error", {
          description: "User ID is missing. Please sign in again."
        });
        return [];
      }
      console.log('User ID for uploads:', user.id);
      for (const image of images) {
        if (!image.file) continue;
        console.log('Uploading image:', image.file.name, 'type:', image.file.type);
        console.log('File details:', {
          name: image.file.name,
          type: image.file.type,
          size: image.file.size,
          lastModified: new Date(image.file.lastModified).toISOString()
        });
        const imageUrl = await uploadImagePreservingFormat('listing-images', user.id, image.file);
        if (!imageUrl) {
          console.error('Failed to upload image:', image.file.name);
          throw new Error(`Failed to upload image: ${image.file.name}`);
        }
        console.log('Image uploaded successfully, URL:', imageUrl);
        uploadedImageUrls.push(imageUrl);
      }
      console.log('All images uploaded:', uploadedImageUrls);
      return uploadedImageUrls;
    } catch (error) {
      console.error('Error in uploadImages:', error);
      toast.error("Image upload failed", {
        description: error instanceof Error ? error.message : "Unknown error during upload"
      });
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("Authentication required", {
        description: "You need to be logged in to create a listing."
      });
      navigate('/auth');
      return;
    }
    if (paymentMethods.length === 0) {
      toast.error("Payment methods required", {
        description: "Please select at least one payment method."
      });
      return;
    }
    if (images.length === 0) {
      toast.error("Images required", {
        description: "Please add at least one image of your item."
      });
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Starting image upload...');
      const imageUrls = await uploadImages();
      console.log('Upload complete, image URLs:', imageUrls);
      if (imageUrls.length === 0) {
        toast.error("Image upload failed", {
          description: "There was a problem uploading your images. Please try again."
        });
        setIsSubmitting(false);
        return;
      }
      console.log('Creating new listing with image URL:', imageUrls[0]);
      const newListingId = await addListing({
        title,
        price: parseFloat(price),
        image: imageUrls[0],
        seller: user.name,
        seller_id: user.id,
        category,
        condition,
        description,
        location,
        contactMethod,
        contactInfo,
        paymentMethods,
        shipping
      });
      if (newListingId) {
        toast.success("Listing created!", {
          description: "Your item has been successfully listed on UofT Market."
        });
        navigate(`/product/${newListingId}`);
      } else {
        toast.error("Error creating listing", {
          description: "There was a problem creating your listing. Please try again."
        });
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Error creating listing", {
        description: "There was a problem creating your listing. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 my-[40px]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
            <p className="text-gray-600 mb-8">
              Fill out the form below to list your item on UofT Market. 
              All fields marked with an asterisk (*) are required.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Item Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="Enter a descriptive title for your item" required value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" required value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select required value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="textbooks">Textbooks</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="housing">Housing</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="academic-services">Academic Services</SelectItem>
                          <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select required value={condition} onValueChange={setCondition}>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea id="description" placeholder="Provide details about your item, including any defects or special features" rows={5} required value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="shipping" checked={shipping} onCheckedChange={setShipping} />
                    <Label htmlFor="shipping">Offer Shipping</Label>
                  </div>
                  
                  <div>
                    <Label>Photos (max 5) *</Label>
                    <div className="mt-2">
                      <ImageUpload images={images} setImages={setImages} maxImages={5} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Meeting Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Preferred Meet-up Location *</Label>
                    <Select required value={location} onValueChange={setLocation}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="st-george">St. George Campus</SelectItem>
                        <SelectItem value="utm">UTM Campus</SelectItem>
                        <SelectItem value="utsc">UTSC Campus</SelectItem>
                        <SelectItem value="robarts">Robarts Library</SelectItem>
                        <SelectItem value="bahen">Bahen Centre</SelectItem>
                        <SelectItem value="sid-smith">Sidney Smith Hall</SelectItem>
                        <SelectItem value="other">Other (specify in description)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Payment Methods Accepted *</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="cash" name="payment" className="h-4 w-4" checked={paymentMethods.includes("cash")} onChange={() => handlePaymentMethodChange("cash")} />
                        <label htmlFor="cash">Cash</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="e-transfer" name="payment" className="h-4 w-4" checked={paymentMethods.includes("e-transfer")} onChange={() => handlePaymentMethodChange("e-transfer")} />
                        <label htmlFor="e-transfer">E-Transfer</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="paypal" name="payment" className="h-4 w-4" checked={paymentMethods.includes("paypal")} onChange={() => handlePaymentMethodChange("paypal")} />
                        <label htmlFor="paypal">PayPal</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="other-payment" name="payment" className="h-4 w-4" checked={paymentMethods.includes("other")} onChange={() => handlePaymentMethodChange("other")} />
                        <label htmlFor="other-payment">Other (specify in description)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-method">Preferred Contact Method *</Label>
                      <Select required value={contactMethod} onValueChange={setContactMethod}>
                        <SelectTrigger id="contact-method">
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-info">Contact Information *</Label>
                      <Input id="contact-info" placeholder="Email address or phone number" required value={contactInfo} onChange={e => setContactInfo(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-start space-x-3 mb-6">
                  <input type="checkbox" id="terms" className="h-4 w-4 mt-1" required />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I confirm that my listing complies with the <a href="/terms" className="text-toronto-blue hover:underline">UofT Market Terms of Service</a> and that I am a current University of Toronto student.
                  </label>
                </div>
                
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting || uploadingImages}>
                  {isSubmitting || uploadingImages ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadingImages ? "Uploading Images..." : "Creating Listing..."}
                    </> : "Create Listing"}
                </Button>
              </div>
            </form>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
              <p className="text-gray-600 mb-4">
                If you're having trouble uploading images, use these tools to diagnose and fix Supabase storage issues:
              </p>
              <div className="space-y-6">
                <StoragePolicyFixer />
                <SupabaseStorageTest />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Sell;