'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Book } from '../types';
import { toast } from 'sonner';
import { api, ApiBook } from '../lib/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('lumina_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const bookIds = parsedCart.map((item: CartItem) => item.bookId);
      
      Promise.all(
        bookIds.map((id: string) => api.get<ApiBook>(`/books/${id}`).catch(() => null))
      ).then((results) => {
        const enrichedCart = parsedCart.map((item: CartItem, index: number) => {
          const apiBook = results[index];
          return {
            ...item,
            stock: apiBook ? apiBook.stock : (item.stock || 0),
          };
        });
        setCart(enrichedCart);
      });
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('lumina_cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.bookId === book.id);
      if (existingItem) {
        if (existingItem.quantity >= book.stock) {
          toast.error(`Only ${book.stock} items available in stock`);
          return prev;
        }
        toast.success(`Updated quantity for ${book.title}`);
        return prev.map(item =>
          item.bookId === book.id ? { ...item, quantity: Math.min(item.quantity + 1, book.stock) } : item
        );
      }
      toast.success(`Added ${book.title} to cart`);
      return [...prev, {
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: 1,
        coverUrl: book.coverUrl,
        stock: book.stock
      }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => {
      const itemToRemove = prev.find(item => item.bookId === bookId);
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.title} from cart`);
      }
      return prev.filter(item => item.bookId !== bookId);
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev => {
      const item = prev.find(i => i.bookId === bookId);
      if (item && quantity > item.stock) {
        toast.error(`Only ${item.stock} items available`);
        return prev.map(i => i.bookId === bookId ? { ...i, quantity: i.stock } : i);
      }
      return prev.map(i => i.bookId === bookId ? { ...i, quantity } : i);
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
