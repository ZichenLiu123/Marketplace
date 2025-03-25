
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Listing, FlaggedListing } from '@/types/listings';
import { useAuthDependentStorage } from '@/hooks/use-local-storage';
import { 
  generateListingId, 
  filterActiveListings, 
  sortListingsByViews,
  filterListingsByLocation,
  filterListingsBySeller,
  filterListingsByUserId
} from '@/utils/listingUtils';
import { cleanupStaleData } from '@/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';
import { deleteListingAndImage } from '@/lib/supabase';

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'postedTime' | 'sellerId'>) => Promise<string>;
  editListing: (id: string, listing: Partial<Listing>) => Promise<boolean>;
  removeListing: (id: string) => Promise<boolean>;
  getUserListings: () => Listing[];
  getListing: (id: string) => Listing | undefined;
  incrementViews: (id: string) => void;
  getFeaturedListings: (count?: number) => Listing[];
  flagListing: (id: string, reason: string) => Promise<boolean>;
  getSellerListings: (sellerName: string) => Listing[];
  clearAllListings: () => void;
  filterListingsByLocation: (location: string) => Listing[];
  refreshListings: () => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const user = auth?.user || null;
  const isAuthenticated = !!user;
  
  const [listings, setListings] = useAuthDependentStorage<Listing[]>('userListings', [], isAuthenticated, 24);
  const [flaggedListings, setFlaggedListings] = useAuthDependentStorage<FlaggedListing[]>('flaggedListings', [], isAuthenticated, 24);

  useEffect(() => {
    cleanupStaleData();
    if (isAuthenticated) {
      refreshListings();
    }
  }, [isAuthenticated]);

  const refreshListings = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching listings:", error);
        return;
      }
      
      const formattedListings: Listing[] = data.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image_url || '',
        seller: '',
        sellerId: item.seller_id,
        category: item.category || '',
        condition: item.condition || '',
        location: item.location || '',
        description: item.description || '',
        postedTime: item.posted_at || new Date().toISOString(),
        contactMethod: item.contact_method || '',
        contactInfo: item.contact_info || '',
        paymentMethods: item.payment_methods || [],
        views: item.views || 0,
        shipping: item.shipping || false,
        deleted: item.deleted || false
      }));
      
      for (const listing of formattedListings) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', listing.sellerId)
          .single();
        
        if (profileData) {
          listing.seller = profileData.name;
        }
      }
      
      setListings(formattedListings);
    } catch (error) {
      console.error("Error in refreshListings:", error);
    }
  };

  const clearAllListings = () => {
    console.log('Clearing all listings from storage');
    setListings([]);
    setFlaggedListings([]);
  };

  const addListing = async (listing: Omit<Listing, 'id' | 'postedTime' | 'sellerId'>): Promise<string> => {
    if (!user) {
      console.error("Cannot add listing without being logged in");
      return "";
    }
    
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          title: listing.title,
          price: listing.price,
          image_url: listing.image,
          seller_id: user.id,
          category: listing.category,
          condition: listing.condition,
          location: listing.location,
          description: listing.description,
          contact_method: listing.contactMethod,
          contact_info: listing.contactInfo,
          payment_methods: listing.paymentMethods,
          views: 0,
          deleted: false
        })
        .select('id')
        .single();
      
      if (error) {
        console.error("Error creating listing in Supabase:", error);
        return "";
      }
      
      const id = data.id;
      
      const newListing: Listing = { 
        ...listing, 
        id,
        postedTime: new Date().toISOString(),
        views: 0,
        deleted: false,
        sellerId: user.id,
        seller: user.name
      };
      
      const updatedListings = [...listings, newListing];
      setListings(updatedListings);
      
      return id;
    } catch (error) {
      console.error("Error in addListing:", error);
      return "";
    }
  };

  const editListing = async (id: string, updates: Partial<Listing>): Promise<boolean> => {
    const listingIndex = listings.findIndex(listing => listing.id === id);
    
    if (listingIndex === -1) return false;
    
    if (user && listings[listingIndex].sellerId !== user.id) {
      console.warn("Cannot edit a listing that doesn't belong to the current user");
      return false;
    }
    
    try {
      const supabaseUpdates: any = {};
      
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.price) supabaseUpdates.price = updates.price;
      if (updates.image) supabaseUpdates.image_url = updates.image;
      if (updates.category) supabaseUpdates.category = updates.category;
      if (updates.condition) supabaseUpdates.condition = updates.condition;
      if (updates.location) supabaseUpdates.location = updates.location;
      if (updates.description) supabaseUpdates.description = updates.description;
      if (updates.contactMethod) supabaseUpdates.contact_method = updates.contactMethod;
      if (updates.contactInfo) supabaseUpdates.contact_info = updates.contactInfo;
      if (updates.paymentMethods) supabaseUpdates.payment_methods = updates.paymentMethods;
      if (updates.shipping !== undefined) supabaseUpdates.shipping = updates.shipping;
      
      supabaseUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('listings')
        .update(supabaseUpdates)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating listing in Supabase:", error);
        return false;
      }
      
      const updatedListings = [...listings];
      updatedListings[listingIndex] = {
        ...updatedListings[listingIndex],
        ...updates,
        id: listings[listingIndex].id,
        postedTime: listings[listingIndex].postedTime,
        views: listings[listingIndex].views || 0,
        sellerId: listings[listingIndex].sellerId,
        seller: listings[listingIndex].seller
      };
      
      setListings(updatedListings);
      return true;
    } catch (error) {
      console.error("Error in editListing:", error);
      return false;
    }
  };

  const incrementViews = async (id: string) => {
    const listingIndex = listings.findIndex(listing => listing.id === id);
    
    if (listingIndex === -1) return;
    
    try {
      await supabase.rpc('increment_listing_views', { 
        listing_uuid: id 
      });
      
      const updatedListings = [...listings];
      updatedListings[listingIndex] = {
        ...updatedListings[listingIndex],
        views: (updatedListings[listingIndex].views || 0) + 1
      };
      
      setListings(updatedListings);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const getFeaturedListings = (count: number = 4): Listing[] => {
    return sortListingsByViews(listings, count);
  };

  const removeListing = async (id: string): Promise<boolean> => {
    const listingIndex = listings.findIndex(listing => listing.id === id);
    
    if (listingIndex === -1) return false;
    
    if (user && listings[listingIndex].sellerId !== user.id) {
      console.warn("Cannot remove a listing that doesn't belong to the current user");
      return false;
    }
    
    try {
      console.log(`Attempting to delete listing with ID: ${id}`);
      const imageUrl = listings[listingIndex].image || listings[listingIndex].image_url;
      
      // Use the new function that deletes both the listing and its image
      const { error } = await deleteListingAndImage(id, imageUrl);
      
      if (error) {
        console.error("Error removing listing:", error);
        return false;
      }
      
      const updatedListings = listings.filter(listing => listing.id !== id);
      setListings(updatedListings);
      
      console.log(`Listing ${id} successfully deleted with its image`);
      return true;
    } catch (error) {
      console.error("Error in removeListing:", error);
      return false;
    }
  };

  const getUserListings = (): Listing[] => {
    if (!user) {
      return [];
    }
    
    return filterListingsByUserId(listings, user.id);
  };
  
  const getListing = (id: string): Listing | undefined => {
    console.log("Looking for listing with ID:", id);
    console.log("Available listings:", listings.map(l => l.id));
    const listing = listings.find(listing => listing.id === id);
    if (listing && listing.deleted) {
      console.log("Listing found but is deleted");
      return undefined;
    }
    console.log("Listing found:", listing);
    return listing;
  };
  
  const flagListing = async (id: string, reason: string): Promise<boolean> => {
    if (!user) {
      console.error("Cannot flag listing without being logged in");
      return false;
    }
    
    const listingExists = listings.some(listing => listing.id === id && !listing.deleted);
    
    if (listingExists) {
      try {
        const { error } = await supabase
          .from('flagged_listings')
          .insert({
            listing_id: id,
            flagger_id: user.id,
            reason
          });
        
        if (error) {
          console.error("Error flagging listing in Supabase:", error);
          return false;
        }
        
        const updatedFlaggedListings = [...flaggedListings, { id, reason }];
        setFlaggedListings(updatedFlaggedListings);
        return true;
      } catch (error) {
        console.error("Error in flagListing:", error);
        return false;
      }
    }
    
    return false;
  };
  
  const getSellerListings = (sellerName: string): Listing[] => {
    return filterListingsBySeller(listings, sellerName);
  };

  return (
    <ListingsContext.Provider value={{ 
      listings: filterActiveListings(listings), 
      addListing, 
      editListing,
      removeListing, 
      getUserListings,
      getListing,
      incrementViews,
      getFeaturedListings,
      flagListing,
      getSellerListings,
      clearAllListings,
      filterListingsByLocation: (location) => filterListingsByLocation(listings, location),
      refreshListings
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  
  return context;
};
