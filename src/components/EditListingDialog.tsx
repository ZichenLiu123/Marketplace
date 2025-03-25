
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useListings } from "@/contexts/ListingsContext";
import { Listing } from "@/types/listings";
import { useToast } from "@/hooks/use-toast";

interface EditListingDialogProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

const EditListingDialog = ({ listing, isOpen, onClose }: EditListingDialogProps) => {
  const { editListing } = useListings();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(listing.price.toString());
  const [category, setCategory] = useState(listing.category || "");
  const [condition, setCondition] = useState(listing.condition || "");
  const [description, setDescription] = useState(listing.description || "");
  const [location, setLocation] = useState(listing.location || "");
  const [contactMethod, setContactMethod] = useState(listing.contactMethod || "");
  const [contactInfo, setContactInfo] = useState(listing.contactInfo || "");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(listing.paymentMethods || []);
  const [image, setImage] = useState(listing.image || "");
  const [shipping, setShipping] = useState(listing.shipping || false);

  // Update form values if listing changes
  useEffect(() => {
    setTitle(listing.title);
    setPrice(listing.price.toString());
    setCategory(listing.category || "");
    setCondition(listing.condition || "");
    setDescription(listing.description || "");
    setLocation(listing.location || "");
    setContactMethod(listing.contactMethod || "");
    setContactInfo(listing.contactInfo || "");
    setPaymentMethods(listing.paymentMethods || []);
    setImage(listing.image || "");
    setShipping(listing.shipping || false);
  }, [listing]);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = editListing(listing.id, {
      title,
      price: parseFloat(price),
      category,
      condition,
      description,
      location,
      contactMethod,
      contactInfo,
      paymentMethods,
      image,
      shipping
    });
    
    if (success) {
      toast({
        title: "Listing updated!",
        description: "Your listing has been successfully updated.",
      });
      onClose();
    } else {
      toast({
        title: "Error updating listing",
        description: "There was a problem updating your listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input 
                id="price" 
                type="number" 
                min="0" 
                step="0.01" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
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
          
          <div className="space-y-2">
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="shipping"
              checked={shipping}
              onCheckedChange={setShipping}
            />
            <Label htmlFor="shipping">Offer Shipping</Label>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Methods Accepted *</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="cash" 
                  name="payment" 
                  className="h-4 w-4" 
                  checked={paymentMethods.includes("cash")}
                  onChange={() => handlePaymentMethodChange("cash")}
                />
                <label htmlFor="cash">Cash</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="e-transfer" 
                  name="payment" 
                  className="h-4 w-4" 
                  checked={paymentMethods.includes("e-transfer")}
                  onChange={() => handlePaymentMethodChange("e-transfer")}
                />
                <label htmlFor="e-transfer">E-Transfer</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="paypal" 
                  name="payment" 
                  className="h-4 w-4" 
                  checked={paymentMethods.includes("paypal")}
                  onChange={() => handlePaymentMethodChange("paypal")}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="other-payment" 
                  name="payment" 
                  className="h-4 w-4" 
                  checked={paymentMethods.includes("other")}
                  onChange={() => handlePaymentMethodChange("other")}
                />
                <label htmlFor="other-payment">Other</label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
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
            
            <div className="space-y-2">
              <Label htmlFor="contact-info">Contact Information *</Label>
              <Input 
                id="contact-info" 
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;
