
export interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  sellerId: string;
  seller_id?: string; // Match Supabase column names
  category?: string;
  condition?: string;
  location?: string;
  description?: string;
  postedTime: string;
  posted_at?: string; // Add this to match Supabase column names
  contactMethod?: string;
  contactInfo?: string;
  paymentMethods?: string[];
  views?: number;
  shipping?: boolean;
  deleted?: boolean;
  image_url?: string; // Match Supabase column names
}

export interface FlaggedListing {
  id: string;
  reason: string;
}
