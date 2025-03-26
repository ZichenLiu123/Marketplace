
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import ImageDisplay from '@/components/ImageDisplay';

interface ProductListItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  category?: string;
  condition?: string;
  postedTime?: string;
  location?: string;
  description?: string;
  onImageError?: () => void;
}

const ProductListItem = ({
  id,
  title,
  price,
  image,
  seller,
  category,
  condition,
  postedTime,
  location,
  description,
  onImageError
}: ProductListItemProps) => {
  const { isSaved, addSavedItem, removeSavedItem } = useSavedItems();
  const { toast } = useToast();

  const handleSaveItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved(id)) {
      removeSavedItem(id);
      toast({
        title: "Item removed",
        description: "This item has been removed from your saved items."
      });
    } else {
      addSavedItem({
        id,
        title,
        price,
        image,
        seller
      });
      toast({
        title: "Item saved",
        description: "This item has been added to your saved items."
      });
    }
  };

  const displayPostedTime = () => {
    if (!postedTime) return 'Recently';
    
    try {
      if (postedTime.includes('ago')) return postedTime;
      
      const date = new Date(postedTime);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <Link to={`/product/${id}`} className="md:w-1/4 h-[200px] md:h-auto relative overflow-hidden">
          <ImageDisplay 
            imageUrl={image}
            alt={title}
            onError={onImageError}
            className="h-full w-full object-cover"
          />
          {condition && (
            <Badge className="absolute top-3 right-3 bg-toronto-blue/80 text-white hover:bg-toronto-blue/90">
              {condition}
            </Badge>
          )}
        </Link>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg hover:text-toronto-blue transition-colors">
                  <Link to={`/product/${id}`}>{title}</Link>
                </h3>
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {category}
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span>{displayPostedTime()}</span>
                {location && (
                  <>
                    <span>•</span>
                    <span className="text-toronto-dark">{location}</span>
                  </>
                )}
              </div>
            </div>
            
            <span className="font-bold text-toronto-blue text-xl">${price.toFixed(2)}</span>
          </div>
          
          {description && (
            <p className="text-gray-600 mt-3 line-clamp-2 text-sm flex-grow">
              {description}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-toronto-blue text-white text-xs font-bold">
                  {seller.charAt(0)}
                </div>
              </div>
              <span className="text-sm font-medium">{seller}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className={`rounded-full ${
                  isSaved(id) ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={handleSaveItem}
              >
                <Heart className={`h-4 w-4 mr-1 ${isSaved(id) ? 'fill-current' : ''}`} />
                <span className="text-xs">{isSaved(id) ? 'Saved' : 'Save'}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link to={`/product/${id}`}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Contact</span>
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link to={`/product/${id}`}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="text-xs">View</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductListItem;
