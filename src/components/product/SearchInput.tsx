
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchInput = ({ searchQuery, setSearchQuery }: SearchInputProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalQuery, setInternalQuery] = useState(searchQuery);

  useEffect(() => {
    setInternalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update parent component's state
    setSearchQuery(internalQuery);
    
    // Update URL without reloading the page
    const searchParams = new URLSearchParams(location.search);
    if (internalQuery) {
      searchParams.set('search', internalQuery);
    } else {
      searchParams.delete('search');
    }
    
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const clearSearch = () => {
    setInternalQuery('');
    setSearchQuery('');
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('search');
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search for products..."
        className="pl-10 pr-20"
        value={internalQuery}
        onChange={(e) => setInternalQuery(e.target.value)}
      />
      {internalQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-14 top-1 h-8 w-8"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button 
        type="submit" 
        size="sm" 
        className="absolute right-1 top-1 h-8"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchInput;
