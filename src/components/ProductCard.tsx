
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
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
}

const ProductCard = ({
  id,
  title,
  price,
  image,
  seller,
  category,
  condition,
  postedTime,
  location
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-soft card-hover border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block relative overflow-hidden aspect-[4/3]">
        {!isImageLoaded && (
          <div className="absolute inset-0 loading-shimmer"></div>
        )}
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        {category && (
          <Badge className="absolute top-3 left-3 bg-white/80 text-toronto-dark hover:bg-white/90">{category}</Badge>
        )}
        {condition && (
          <Badge className="absolute top-3 right-3 bg-toronto-blue/80 text-white hover:bg-toronto-blue/90">{condition}</Badge>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          className={`absolute bottom-3 right-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-300 ${
            isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1 hover:text-toronto-blue transition-colors">
            <Link to={`/product/${id}`}>{title}</Link>
          </h3>
          <span className="font-bold text-toronto-blue">${price.toFixed(2)}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          {location && <span className="block text-toronto-dark">{location}</span>}
          {postedTime && <span className="block">{postedTime}</span>}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-toronto-blue text-white text-xs font-bold">
                {seller.charAt(0)}
              </div>
            </div>
            <span className="text-sm font-medium">{seller}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="p-1 h-8" asChild>
            <Link to={`/product/${id}`}>
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Contact</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
