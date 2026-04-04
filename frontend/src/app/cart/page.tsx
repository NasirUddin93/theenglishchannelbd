'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any books to your collection yet. Start browsing our library!</p>
        <Link href="/shop" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-500">You have {totalItems} items in your cart</p>
        </div>
        <Link href="/shop" className="text-orange-600 font-bold hover:underline">Continue Shopping</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.bookId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0">
                  <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/book/${item.bookId}`} className="font-serif text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors block truncate">
                    {item.title}
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">{item.author}</p>
                  <p className="text-xs text-gray-700 font-semibold mb-2">Stock: {item.stock}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                        className="p-1 hover:bg-white hover:text-orange-600 rounded-lg transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={cn(
                          "p-1 rounded-lg transition-all",
                          item.quantity >= item.stock 
                            ? "text-gray-300 cursor-not-allowed" 
                            : "hover:bg-white hover:text-orange-600"
                        )}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.bookId)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-orange-900/5 space-y-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-xs tracking-widest">Free</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
              </div>
              <div className="w-px h-3 bg-gray-100"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Free Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}