'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Book, CourseCartItem } from '../types';
import { toast } from 'sonner';
import { api, joinStorage } from '../lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  addToCartCourse: (course: CourseCartItem) => void;
  removeFromCart: (bookId: string) => void;
  removeFromCartCourse: (courseId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && mounted && cart.length > 0) {
      localStorage.setItem('lumina_cart', JSON.stringify(cart));
    }
  }, [cart, mounted, user]);

  useEffect(() => {
    const handleCartClear = () => {
      setCart([]);
      localStorage.removeItem('lumina_cart');
    };
    window.addEventListener('cart-clear', handleCartClear);
    return () => window.removeEventListener('cart-clear', handleCartClear);
  }, []);

  useEffect(() => {
    console.log('Cart DB effect: user:', user?.email, 'mounted:', mounted, 'user truthy:', !!user);
    if (!user || !mounted) return;
    console.log('Loading cart from DB for user:', user.email);
    fetch('http://localhost:8000/api/cart', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Accept': 'application/json',
      },
    })
      .then(r => r.json())
      .then((res) => {
        console.log('Cart response direct fetch:', res);
        if (res?.items && res.items.length > 0) {
          const dbItems = res.items.map((item: any) => {
            if (item.type === 'book' && item.book) {
              return {
                bookId: String(item.book.id),
                type: 'book',
                title: item.book.title,
                author: item.book.author,
                price: parseFloat(item.book.price),
                quantity: item.quantity,
                coverUrl: item.book.image,
                stock: item.book.stock
              };
            } else if (item.type === 'course' && item.course) {
              return {
                courseId: String(item.course.id),
                type: 'course',
                title: item.course.title,
                author: item.course.instructor,
                price: parseFloat(item.course.price),
                quantity: 1,
                coverUrl: item.course.image,
                stock: 999,
                instructor: item.course.instructor,
                slug: item.course.slug,
              };
            }
            return null;
          }).filter(Boolean);
          setCart(dbItems);
          localStorage.removeItem('lumina_cart');
        }
      })
      .catch((e) => console.log('Cart fetch error:', e));
  }, [user, mounted]);

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.bookId === book.id);
      if (existingItem) {
        if (existingItem.quantity >= book.stock) {
          toast.error(`Only ${book.stock} items available in stock`);
          return prev;
        }
        toast.success(`Updated quantity for ${book.title}`);
        return prev.map((item) =>
          item.bookId === book.id ? { ...item, quantity: Math.min(item.quantity + 1, book.stock) } : item
        );
      }
      toast.success(`Added ${book.title} to cart`);
      return [...prev, {
        bookId: book.id,
        type: 'book',
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: 1,
        coverUrl: book.coverUrl,
        stock: book.stock
      }];
    });
  };

  const addToCartCourse = (course: CourseCartItem) => {
    if (user) {
      const orders = JSON.parse(localStorage.getItem('lumina_orders') || '[]');
      const alreadyOwned = orders.some((order: any) => {
        if (order.status === 'cancelled') return false;
        return order.items.some((item: any) => 
          item.type === 'course' && String(item.courseId || item.bookId) === String(course.id)
        );
      });

      if (alreadyOwned) {
        toast.info(`You already own "${course.title}"`);
        return;
      }
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.courseId === String(course.id));
      if (existingItem) {
        toast.info(`${course.title} is already in your cart`);
        return prev;
      }
      toast.success(`Added ${course.title} to cart`);

      const courseImg = course.image;
      const finalCoverUrl = courseImg
        ? (courseImg.startsWith('http') ? courseImg : joinStorage('http://localhost:8000/storage', courseImg))
        : null;

      return [...prev, {
        courseId: String(course.id),
        type: 'course',
        title: course.title,
        author: course.instructor,
        price: course.price,
        quantity: 1,
        coverUrl: finalCoverUrl,
        stock: 999,
        instructor: course.instructor,
        slug: course.slug,
      }];
    });
  };

  const removeFromCart = (bookId: string) => {
    const itemToRemove = cart.find((item) => item.bookId === bookId);
    setCart((prev) => prev.filter((item) => item.bookId !== bookId));
    if (itemToRemove) {
      toast.info(`Removed ${itemToRemove.title} from cart`);
    }
    if (user && itemToRemove) {
      api.post('/cart/update', { book_id: bookId, quantity: 0 }).catch(() => {});
    }
  };

  const removeFromCartCourse = (courseId: string) => {
    const itemToRemove = cart.find((item) => item.courseId === courseId);
    setCart((prev) => prev.filter((item) => item.courseId !== courseId));
    if (itemToRemove) {
      toast.info(`Removed ${itemToRemove.title} from cart`);
    }
    if (user && itemToRemove) {
      api.post('/cart/update', { course_id: courseId, quantity: 0 }).catch(() => {});
    }
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) => {
      const item = prev.find((i) => i.bookId === bookId);
      if (item && quantity > item.stock) {
        toast.error(`Only ${item.stock} items available`);
        return prev.map((i) => i.bookId === bookId ? { ...i, quantity: i.stock } : i);
      }
      return prev.map((i) => i.bookId === bookId ? { ...i, quantity } : i);
    });
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      api.delete('/cart').catch(() => {});
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, addToCartCourse, removeFromCart, removeFromCartCourse, updateQuantity, clearCart, totalItems, totalPrice }}>
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