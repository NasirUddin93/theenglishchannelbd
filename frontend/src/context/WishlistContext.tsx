'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface WishlistContextType {
  wishlistMap: Record<string, boolean>;
  checkWishlist: (bookIds: string[]) => Promise<void>;
  toggleWishlist: (bookId: string) => Promise<boolean>;
  isInWishlist: (bookId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>({});

  const checkWishlist = useCallback(async (bookIds: string[]) => {
    if (bookIds.length === 0) return;
    
    try {
      const res = await api.get<{ wishlist: Record<string, boolean> }>('/wishlist/check-batch', { 
        book_ids: bookIds.join(',') 
      });
      setWishlistMap(prev => ({ ...prev, ...(res.wishlist || {}) }));
    } catch (err) {
      console.error('Failed to check wishlist:', err);
    }
  }, []);

  const toggleWishlist = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      const res = await api.post<{ action: string }>('/wishlist/toggle', {
        book_id: parseInt(bookId),
      });
      setWishlistMap(prev => ({ ...prev, [bookId]: res.action === 'added' }));
      return res.action === 'added';
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      throw err;
    }
  }, []);

  const isInWishlist = useCallback((bookId: string): boolean => {
    return wishlistMap[bookId] || false;
  }, [wishlistMap]);

  return (
    <WishlistContext.Provider value={{ wishlistMap, checkWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
