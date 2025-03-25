
import { Listing } from '@/types/listings';

export const generateListingId = (): string => {
  return `listing-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const isListingActive = (listing: Listing): boolean => {
  return !listing.deleted;
};

export const filterActiveListings = (listings: Listing[]): Listing[] => {
  return listings.filter(isListingActive);
};

export const sortListingsByViews = (listings: Listing[], count: number = 4): Listing[] => {
  return [...listings]
    .filter(isListingActive)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, count);
};

export const filterListingsByLocation = (listings: Listing[], location: string): Listing[] => {
  if (!location || location.trim() === '') {
    const activeListings = filterActiveListings(listings);
    console.log("No location filter, returning all active listings:", activeListings.length);
    return activeListings;
  }
  
  const filteredListings = listings.filter(listing => 
    isListingActive(listing) && 
    listing.location && 
    listing.location.toLowerCase().includes(location.toLowerCase())
  );
  console.log("Filtered listings by location:", filteredListings.length);
  return filteredListings;
};

export const filterListingsBySeller = (listings: Listing[], sellerName: string): Listing[] => {
  console.log("Getting listings for seller:", sellerName);
  return listings.filter(listing => 
    listing.seller === sellerName && isListingActive(listing)
  );
};

export const filterListingsByUserId = (listings: Listing[], userId: string): Listing[] => {
  console.log("Getting user listings for user ID:", userId);
  const userListings = listings.filter(listing => 
    isListingActive(listing) && 
    listing.sellerId === userId
  );
  console.log("User listings found:", userListings.length);
  return userListings;
};
