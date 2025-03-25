
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SavedItem {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  savedDate: string;
}

interface SavedItemsContextType {
  savedItems: SavedItem[];
  addSavedItem: (item: Omit<SavedItem, 'savedDate'>) => void;
  removeSavedItem: (id: string) => boolean;
  isSaved: (id: string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const storedItems = localStorage.getItem('savedItems');
    return storedItems ? JSON.parse(storedItems) : [];
  });

  // Persist saved items to localStorage
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const addSavedItem = (item: Omit<SavedItem, 'savedDate'>) => {
    // Don't add if already exists
    if (savedItems.some(savedItem => savedItem.id === item.id)) {
      return;
    }
    
    const newItem = { 
      ...item, 
      savedDate: new Date().toISOString().split('T')[0] 
    };
    
    setSavedItems(prev => [...prev, newItem]);
  };

  const removeSavedItem = (id: string): boolean => {
    const itemExists = savedItems.some(item => item.id === id);
    
    if (itemExists) {
      setSavedItems(prev => prev.filter(item => item.id !== id));
      return true;
    }
    
    return false;
  };

  const isSaved = (id: string): boolean => {
    return savedItems.some(item => item.id === id);
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, addSavedItem, removeSavedItem, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  
  if (context === undefined) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  
  return context;
};
