
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

const LOCATIONS = [
  'St. George',
  'Mississauga',
  'Scarborough',
  'Robarts Library',
  'Bahen Centre',
  'Sidney Smith Hall',
  'Medical Sciences Building',
  'Myhal Centre',
  'Wallberg Building',
  'Off-Campus'
];

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
  mobileFiltersOpen: boolean;
}

const ProductFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  resetFilters,
  mobileFiltersOpen
}: ProductFiltersProps) => {
  return (
    <div className={`lg:w-1/4 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
      <Card className="sticky top-20">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-auto p-1 text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-xs">Reset</span>
            </Button>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Category</h4>
            <div className="space-y-1">
              {['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Services', 'Other'].map((category) => (
                <div key={category} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start px-2 py-1 h-auto text-sm ${
                      selectedCategory === category.toLowerCase() ? 'text-toronto-blue bg-toronto-blue/10' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                  >
                    {category}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Location</h4>
            <div className="space-y-1">
              {LOCATIONS.map((location) => (
                <div key={location} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start px-2 py-1 h-auto text-sm ${
                      selectedLocation === location ? 'text-toronto-blue bg-toronto-blue/10' : ''
                    }`}
                    onClick={() => setSelectedLocation(location === selectedLocation ? '' : location)}
                  >
                    {location}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Price Range</h4>
            <div className="px-2">
              <Slider
                defaultValue={[0, 1000]}
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="text-sm font-medium mb-3">Sort By</h4>
            <div className="space-y-1">
              {[
                { id: 'newest', name: 'Newest First' },
                { id: 'oldest', name: 'Oldest First' },
                { id: 'price-low', name: 'Price: Low to High' },
                { id: 'price-high', name: 'Price: High to Low' }
              ].map((option) => (
                <div key={option.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start px-2 py-1 h-auto text-sm ${
                      sortBy === option.id ? 'text-toronto-blue bg-toronto-blue/10' : ''
                    }`}
                    onClick={() => setSortBy(option.id)}
                  >
                    {option.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;
