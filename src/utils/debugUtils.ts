
import { Listing } from '@/types/listings';

export const createMockListings = (): Listing[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'sample-listing-1',
      title: 'MacBook Pro M2 - Nearly New',
      price: 1200.00,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
      category: 'electronics',
      condition: 'Like New',
      seller: 'Maya T',
      sellerId: 'seller-1',
      postedTime: now,
      location: 'St. George Campus',
      views: 52,
      deleted: false,
      description: 'Almost new MacBook Pro with M2 chip. Only used for 2 months.'
    },
    {
      id: 'sample-listing-2',
      title: 'Calculus & Linear Algebra Textbooks Bundle',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
      category: 'textbooks',
      condition: 'Good',
      seller: 'Jayden K',
      sellerId: 'seller-2',
      postedTime: now,
      location: 'Robarts Library',
      views: 38,
      deleted: false,
      description: 'Bundle of first-year math textbooks in good condition.'
    },
    {
      id: 'sample-listing-3',
      title: 'Study Desk and Chair Set',
      price: 120.00,
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
      category: 'furniture',
      condition: 'New',
      seller: 'Aisha M',
      sellerId: 'seller-3',
      postedTime: now,
      location: 'Mississauga Campus',
      views: 45,
      deleted: false,
      description: 'Brand new study desk and chair set, perfect for dorm room.'
    }
  ];
};
