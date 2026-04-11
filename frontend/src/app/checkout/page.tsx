'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Truck, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, ShoppingBag, Tag, GraduationCap, Phone, Percent, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { MOCK_PROMO_CODES } from '@/lib/mockData';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const hasBooks = cart.some(item => item.type === 'book');
  const hasCourses = cart.some(item => item.type === 'course');
  const onlyCourses = hasCourses && !hasBooks;

  const generateOrderNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ORD-${result}`;
  };

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    if (step === 'shipping') {
      setOrderNumber('');
    }
  }, [step]);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>(hasBooks && !cart.some(item => item.type === 'course') ? 'cod' : 'bkash');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, amount: number } | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: '',
    transactionId: '',
  });
  const [siteSettings, setSiteSettings] = useState<{
    bkash_number: string;
    nagad_number: string;
    cod_charge: number;
    bkash_discount_percent: number;
    nagad_discount_percent: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (onlyCourses && step === 'shipping') {
      setStep('payment');
    }
  }, [onlyCourses, step]);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await api.get('/site-settings');
        if (res && typeof res === 'object' && 'bkash_number' in res) {
          setSiteSettings(res as any);
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      }
    };
    fetchSiteSettings();
  }, []);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    const found = MOCK_PROMO_CODES.find(p => p.code.toUpperCase() === promoCode.trim().toUpperCase());
    if (found) {
      let discountAmount = 0;
      if (found.type === 'fixed') {
        discountAmount = found.discount;
      } else {
        discountAmount = totalPrice * found.discount;
      }
      setAppliedDiscount({ code: found.code, amount: discountAmount });
      toast.success(`Promo code ${found.code} applied!`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const finalTotal = (() => {
    let total = Number(totalPrice || 0) - Number(appliedDiscount?.amount || 0);
    if (paymentMethod === 'bkash' && siteSettings?.bkash_discount_percent) {
      total = total * (1 - siteSettings.bkash_discount_percent / 100);
    } else if (paymentMethod === 'nagad' && siteSettings?.nagad_discount_percent) {
      total = total * (1 - siteSettings.nagad_discount_percent / 100);
    } else if (paymentMethod === 'cod' && siteSettings?.cod_charge) {
      total = total + Number(siteSettings.cod_charge);
    }
    return total;
  })();

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!paymentDetails.mobileNumber.trim() || !paymentDetails.transactionId.trim())) {
      toast.error('Please enter your mobile number and transaction ID');
      return;
    }

    setLoading(true);

    // Prepare order payload for API
    const hasOnlyCourses = cart.every(item => item.type === 'course');
    const discountAmount = (() => {
      if (paymentMethod === 'bkash' && siteSettings?.bkash_discount_percent) {
        return (totalPrice - (appliedDiscount?.amount || 0)) * (siteSettings.bkash_discount_percent / 100);
      } else if (paymentMethod === 'nagad' && siteSettings?.nagad_discount_percent) {
        return (totalPrice - (appliedDiscount?.amount || 0)) * (siteSettings.nagad_discount_percent / 100);
      }
      return 0;
    })();
    const codCharge = (paymentMethod === 'cod' && siteSettings?.cod_charge) ? Number(siteSettings.cod_charge) : 0;
    const orderPayload = {
      payment_method: paymentMethod,
      payment_mobile: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? paymentDetails.mobileNumber : null,
      transaction_id: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? paymentDetails.transactionId : null,
      discount_amount: Number(discountAmount) || 0,
      cod_charge: codCharge,
      notes: `Discount: ৳${discountAmount.toFixed(2)}, COD Charge: ৳${codCharge.toFixed(2)}`,
      items: cart.map(item => ({
        type: item.type,
        book_id: item.type === 'book' ? parseInt(item.bookId || '0') : null,
        course_id: item.type === 'course' ? parseInt(item.courseId || '0') : null,
        quantity: item.quantity || 1,
        price: Number(item.price || 0),
      })),
      ...(hasOnlyCourses ? {
        // Course-only order: minimal required fields
        shipping_address: 'N/A - Course Enrollment',
        city: 'N/A',
        phone: user.phone || '0000000000',
      } : {
        // Mixed order: include shipping details
        shipping_address: shippingData.address,
        city: shippingData.city,
        postal_code: shippingData.zipCode,
        phone: shippingData.phone || user.phone || '0000000000',
      }),
    };

    console.log('[Checkout] Sending order to API:', JSON.stringify(orderPayload, null, 2));

    try {
      // Save order to database via API
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('[Checkout] API Error:', response.status, JSON.stringify(responseData, null, 2));
        console.error('[Checkout] Response message:', responseData.message);
        toast.error(responseData.message || 'Failed to place order');
        setLoading(false);
        return;
      } else {
        console.log('[Checkout] Order saved to database successfully:', responseData);
        if (responseData.order?.order_number) {
          setOrderNumber(responseData.order.order_number);
        } else if (responseData.order?.id) {
          setOrderNumber(`ORD-${responseData.order.id}`);
        }
      }
    } catch (error) {
      console.error('[Checkout] Error saving order to database:', error);
    }

    // Also save to localStorage for immediate use
    setTimeout(() => {
      const newOrderId = orderNumber || generateOrderNumber();
      const orderData = {
        id: newOrderId,
        userId: user.uid,
        items: cart,
        total: finalTotal,
        status: hasOnlyCourses ? 'completed' : 'pending',
        paymentMethod,
        shippingAddress: hasOnlyCourses ? null : shippingData,
        createdAt: new Date().toISOString(),
        discount: appliedDiscount,
        type: hasOnlyCourses ? 'course-enrollment' : 'mixed',
      };

      const existingOrders = JSON.parse(localStorage.getItem('lumina_orders') || '[]');
      localStorage.setItem('lumina_orders', JSON.stringify([orderData, ...existingOrders]));

      clearCart();
      setStep('success');
      try { window.dispatchEvent(new Event('orders-changed')); } catch (err) {}
      setLoading(false);
    }, 1500);
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <div className="flex gap-4">
          <Link href="/shop" className="text-orange-600 font-bold hover:underline">Go back to shop</Link>
          <Link href="/courses" className="text-orange-600 font-bold hover:underline">Browse courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-center gap-8 mb-12">
        {[
          { id: 'shipping', label: 'Shipping', icon: Truck },
          { id: 'payment', label: 'Payment', icon: Phone },
          { id: 'success', label: 'Confirmation', icon: CheckCircle2 },
        ].map((s, i) => (
          <div key={s.id} className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              step === s.id ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : 
              (i < (step === 'payment' ? 1 : step === 'success' ? 2 : 0) ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")
            )}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-sm font-bold uppercase tracking-widest hidden md:block",
              step === s.id ? "text-gray-900" : "text-gray-400"
            )}>{s.label}</span>
            {i < 2 && <div className="w-12 h-px bg-gray-100 hidden md:block"></div>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!onlyCourses && step === 'shipping' && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-8 space-y-8">
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Shipping Information</h2>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">Profile Linked</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={shippingData.fullName}
                      readOnly
                      className="w-full p-4 bg-gray-100 border border-transparent rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={shippingData.email}
                      readOnly
                      className="w-full p-4 bg-gray-100 border border-transparent rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Street Address</label>
                    <input 
                      type="text" 
                      value={shippingData.address}
                      onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">City</label>
                    <input 
                      type="text" 
                      value={shippingData.city}
                      onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Zip Code</label>
                    <input 
                      type="text" 
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      value={shippingData.phone}
                      onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Link href="/cart" className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Cart</span>
                </Link>
                <button 
                  onClick={() => {
                    if (!shippingData.address.trim() || !shippingData.city.trim() || !shippingData.zipCode.trim() || !shippingData.phone.trim()) {
                      toast.error('Please fill in all shipping details');
                      return;
                    }
                    if (shippingData.phone.length < 11) {
                      toast.error('Please enter a valid 11-digit phone number');
                      return;
                    }
                    setStep('payment');
                  }}
                  className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <OrderSummary 
                cart={cart} 
                totalPrice={totalPrice} 
                promoCode={promoCode} 
                setPromoCode={setPromoCode} 
                handleApplyPromo={handleApplyPromo}
                appliedDiscount={appliedDiscount}
                finalTotal={finalTotal}
                paymentMethod={paymentMethod}
                siteSettings={siteSettings}
              />
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-8 space-y-8">
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Payment Method</h2>
                {onlyCourses && (
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <p className="text-sm text-orange-700 font-medium">Course enrollment — no shipping required. Access will be available immediately after payment.</p>
                  </div>
                )}
                <div className="space-y-4">
                  {[
                    { id: 'bkash', label: 'bKash', icon: Phone, desc: 'Pay via bKash mobile wallet' },
                    { id: 'nagad', label: 'Nagad', icon: Phone, desc: 'Pay via Nagad mobile wallet' },
                    ...(hasBooks && !cart.some(item => item.type === 'course') ? [{ id: 'cod', label: 'Cash on Delivery', icon: Truck, desc: 'Pay when you receive your books' }] : []),
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "w-full flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left",
                        paymentMethod === method.id ? "border-orange-600 bg-orange-50/30" : "border-gray-100 hover:border-orange-200"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        paymentMethod === method.id ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-400"
                      )}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        paymentMethod === method.id ? "border-orange-600" : "border-gray-200"
                      )}>
                        {paymentMethod === method.id && <div className="w-3 h-3 bg-orange-600 rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>

                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                    {paymentMethod === 'bkash' && siteSettings?.bkash_discount_percent && siteSettings.bkash_discount_percent > 0 && (
                      <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-sm text-green-700 font-medium">
                          🎉 You get {siteSettings.bkash_discount_percent}% discount on bKash payment!
                        </p>
                      </div>
                    )}
                    {paymentMethod === 'nagad' && siteSettings?.nagad_discount_percent && siteSettings.nagad_discount_percent > 0 && (
                      <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-sm text-green-700 font-medium">
                          🎉 You get {siteSettings.nagad_discount_percent}% discount on Nagad payment!
                        </p>
                      </div>
                    )}
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <p className="text-sm text-orange-700 font-medium">
                        <span className="font-bold">Instructions:</span> Send ৳{finalTotal.toFixed(2)} to our {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} number <span className="font-bold">{paymentMethod === 'bkash' ? (siteSettings?.bkash_number || '01XXXXXXXXX') : (siteSettings?.nagad_number || '01XXXXXXXXX')}</span> and enter the transaction details below.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number</label>
                      <input 
                        type="tel" 
                        placeholder="01XXXXXXXXX" 
                        value={paymentDetails.mobileNumber}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileNumber: e.target.value })}
                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction ID</label>
                      <input 
                        type="text" 
                        placeholder="Enter transaction ID" 
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      You will receive a confirmation once the payment is verified.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                {!onlyCourses ? (
                  <button 
                    onClick={() => setStep('shipping')}
                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Shipping</span>
                  </button>
                ) : (
                  <Link href="/cart" className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Cart</span>
                  </Link>
                )}
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-12 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ShieldCheck className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <OrderSummary 
                cart={cart} 
                totalPrice={totalPrice} 
                promoCode={promoCode} 
                setPromoCode={setPromoCode} 
                handleApplyPromo={handleApplyPromo}
                appliedDiscount={appliedDiscount}
                finalTotal={finalTotal}
                paymentMethod={paymentMethod}
                siteSettings={siteSettings}
              />
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-20 space-y-8"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            {onlyCourses ? (
              <>
                <h1 className="font-serif text-5xl font-bold text-gray-900">Enrollment Confirmed!</h1>
                <p className="text-xl text-gray-500">Thank you for enrolling. You now have access to your courses. Check your email at <span className="text-gray-900 font-bold">{shippingData.email}</span> for details.</p>
              </>
            ) : (
              <>
                <h1 className="font-serif text-5xl font-bold text-gray-900">Order Confirmed!</h1>
                <p className="text-xl text-gray-500">Thank you for your purchase. We've sent a confirmation email to <span className="text-gray-900 font-bold">{shippingData.email}</span>.</p>
              </>
            )}
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Order Number</span>
                <span className="text-gray-900 font-bold">{orderNumber || generateOrderNumber()}</span>
              </div>
              {onlyCourses ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">Access</span>
                  <span className="text-green-600 font-bold">Available Now</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">Estimated Delivery</span>
                  <span className="text-gray-900 font-bold">3-5 Business Days</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
                View Order History
              </Link>
              <Link href="/shop" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderSummary({ 
  cart, 
  totalPrice, 
  promoCode, 
  setPromoCode, 
  handleApplyPromo,
  appliedDiscount,
  finalTotal,
  paymentMethod,
  siteSettings
}: { 
  cart: any[], 
  totalPrice: number,
  promoCode: string,
  setPromoCode: (v: string) => void,
  handleApplyPromo: () => void,
  appliedDiscount: { code: string, amount: number } | null,
  finalTotal: number,
  paymentMethod: string,
  siteSettings: any
}) {
  const paymentDiscount = (() => {
    if (paymentMethod === 'bkash' && siteSettings?.bkash_discount_percent) {
      return (totalPrice - (appliedDiscount?.amount || 0)) * (siteSettings.bkash_discount_percent / 100);
    } else if (paymentMethod === 'nagad' && siteSettings?.nagad_discount_percent) {
      return (totalPrice - (appliedDiscount?.amount || 0)) * (siteSettings.nagad_discount_percent / 100);
    }
    return 0;
  })();
  
  const codCharge = (paymentMethod === 'cod' && siteSettings?.cod_charge) ? Number(siteSettings.cod_charge) : 0;

  return (
    <div className="sticky top-24 p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-orange-900/5 space-y-8">
      <h3 className="text-2xl font-serif font-bold text-gray-900">Order Summary</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {cart.map(item => (
          <div key={item.bookId || item.courseId} className="flex gap-4">
            <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 relative">
              <img src={item.coverUrl} className="w-full h-full object-cover" />
              {item.type === 'course' && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 to-amber-500/80 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              {item.type === 'course' && (
                <p className="text-[10px] text-orange-600 font-semibold">Course</p>
              )}
            </div>
            <p className="text-sm font-bold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-100 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Promo Code</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter code" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-3 bg-gray-50 border border-transparent rounded-xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none text-sm"
            />
            <button 
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-50">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">৳{totalPrice.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-green-600 text-sm">
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Promo ({appliedDiscount.code})</span>
              </div>
              <span className="font-bold">-৳{appliedDiscount.amount.toFixed(2)}</span>
            </div>
          )}
          {paymentDiscount > 0 && (
            <div className="flex justify-between text-green-600 text-sm">
              <div className="flex items-center gap-1">
                <Percent className="w-3 h-3" />
                <span>{paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Discount</span>
              </div>
              <span className="font-bold">-৳{paymentDiscount.toFixed(2)}</span>
            </div>
          )}
          {codCharge > 0 && (
            <div className="flex justify-between text-orange-600 text-sm">
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>COD Charge</span>
              </div>
              <span className="font-bold">+৳{codCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-4 flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">৳{finalTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
