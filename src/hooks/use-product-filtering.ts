
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';
import { Listing } from '@/types/listings';

export const useProductFiltering = (allListings: Listing[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, setSearchParams]);

  const filteredListings = allListings
    .filter(listing => {
      // Ensure listing is not deleted
      if (listing.deleted) {
        return false;
      }
      
      // Search query filter
      const matchesSearch = !debouncedSearch || 
        (listing.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
         listing.description?.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      // Category filter - case insensitive comparison
      const matchesCategory = !selectedCategory || 
        (!listing.category && !selectedCategory) || // If both are empty/undefined
        (listing.category && selectedCategory && 
         listing.category.toLowerCase() === selectedCategory.toLowerCase());
      
      // Price filter
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setPriceRange([0, 1000]);
    setSortBy('newest');
    setSearchParams(new URLSearchParams());
  };

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'oldest':
        return new Date(a.postedTime).getTime() - new Date(b.postedTime).getTime();
      case 'newest':
      default:
        return new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime();
    }
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    filteredListings,
    sortedListings,
    resetFilters
  };
};
