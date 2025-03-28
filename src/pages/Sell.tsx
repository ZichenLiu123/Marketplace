
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload } from "lucide-react";

const Sell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Listing created!",
        description: "Your item has been successfully listed on UofT Market.",
      });
      navigate("/"); // Redirect to home page
    }, 1500);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Show preview for the uploaded images
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages(prev => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
            <p className="text-gray-600 mb-8">
              Fill out the form below to list your item on UofT Market. 
              All fields marked with an asterisk (*) are required.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Item Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a descriptive title for your item" 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select required>
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
                    <Select required>
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
                    <Textarea
                      id="description"
                      placeholder="Provide details about your item, including any defects or special features"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Photos (max 5) *</Label>
                    <div className="mt-2 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-gray-50">
                            <img 
                              src={image} 
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                              onClick={() => setImages(images.filter((_, i) => i !== index))}
                            >
                              <span className="sr-only">Remove</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        
                        {images.length < 5 && (
                          <div className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4 hover:bg-gray-50 cursor-pointer">
                            <Label htmlFor="image-upload" className="cursor-pointer text-center">
                              <Camera className="mx-auto h-8 w-8 text-gray-400" />
                              <span className="mt-2 block text-sm font-medium text-gray-600">
                                Add Photo
                              </span>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </Label>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Upload up to 5 photos of your item. The first photo will be the cover image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Meeting Preferences */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Meeting Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Preferred Meet-up Location *</Label>
                    <Select required>
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
                        <input type="checkbox" id="cash" name="payment" className="h-4 w-4" />
                        <label htmlFor="cash">Cash</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="e-transfer" name="payment" className="h-4 w-4" />
                        <label htmlFor="e-transfer">E-Transfer</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="paypal" name="payment" className="h-4 w-4" />
                        <label htmlFor="paypal">PayPal</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="other-payment" name="payment" className="h-4 w-4" />
                        <label htmlFor="other-payment">Other (specify in description)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-method">Preferred Contact Method *</Label>
                      <Select required>
                        <SelectTrigger id="contact-method">
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="message">In-app Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-info">Contact Information *</Label>
                      <Input 
                        id="contact-info" 
                        placeholder="Email address or phone number" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terms and Submission */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-start space-x-3 mb-6">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="h-4 w-4 mt-1" 
                    required 
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I confirm that my listing complies with the <a href="/terms" className="text-toronto-blue hover:underline">UofT Market Terms of Service</a> and that I am a current University of Toronto student.
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Listing..." : "Create Listing"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sell;
