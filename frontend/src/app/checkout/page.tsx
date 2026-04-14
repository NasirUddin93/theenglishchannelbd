'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  Truck, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck,
  ShoppingBag, Tag, GraduationCap, Phone, Percent, CreditCard,
  Sparkles, Package, BookOpen, MapPin, Mail, Lock, BadgeCheck,
  RefreshCw, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { MOCK_PROMO_CODES } from '@/lib/mockData';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

/* ── Shared input styles ─────────────────────────────────────── */
const inputBase = `w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none border transition-all duration-200
  placeholder-gray-300`;
const inputReadonly = `${inputBase} bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed`;
const inputEditable = `${inputBase} bg-white border-gray-200 text-gray-900
  focus:border-orange-400 focus:ring-4 focus:ring-orange-50 hover:border-gray-300`;

/* ── Label ───────────────────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

/* ── Step indicator ──────────────────────────────────────────── */
const STEPS = [
  { id: 'shipping',  label: 'Shipping',     icon: Truck },
  { id: 'payment',   label: 'Payment',      icon: Phone },
  { id: 'success',   label: 'Confirmation', icon: CheckCircle2 },
];
const stepIndex = (s: string) => STEPS.findIndex(x => x.id === s);

function StepBar({ step }: { step: string }) {
  const current = stepIndex(step);
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border-2',
                active ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200'
                       : done  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                               : 'bg-gray-50 border-gray-200 text-gray-300'
              )}>
                {done ? <BadgeCheck className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn('text-[10px] font-bold uppercase tracking-widest hidden sm:block',
                active ? 'text-gray-900' : done ? 'text-emerald-600' : 'text-gray-300')}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-3 mb-5 flex items-center">
                <div className={cn('h-0.5 w-12 sm:w-20 rounded-full transition-all duration-500',
                  i < current ? 'bg-emerald-300' : 'bg-gray-100')} />
                <ChevronRight className={cn('w-3.5 h-3.5 -ml-1', i < current ? 'text-emerald-300' : 'text-gray-200')} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const hasBooks    = cart.some(i => i.type === 'book');
  const hasCourses  = cart.some(i => i.type === 'course');
  const onlyCourses = hasCourses && !hasBooks;

  const generateOrderNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return `ORD-${Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
  };

  const [step,           setStep]          = useState<'shipping'|'payment'|'success'>('shipping');
  const [loading,        setLoading]       = useState(false);
  const [orderNumber,    setOrderNumber]   = useState('');
  const [shippingData,   setShippingData]  = useState({ fullName:'', email:'', address:'', city:'', zipCode:'', phone:'' });
  const [paymentMethod,  setPaymentMethod] = useState<'cod'|'bkash'|'nagad'>(hasBooks ? 'cod' : 'bkash');
  const [promoCode,      setPromoCode]     = useState('');
  const [appliedDiscount,setAppliedDiscount] = useState<{code:string;amount:number}|null>(null);
  const [paymentDetails, setPaymentDetails] = useState({ mobileNumber:'', transactionId:'' });
  const [siteSettings,   setSiteSettings]  = useState<any>(null);

  useEffect(() => { if (step === 'shipping') setOrderNumber(''); }, [step]);

  useEffect(() => {
    if (user) setShippingData(prev => ({
      ...prev,
      fullName: user.displayName || '',
      email:    user.email       || '',
      address:  user.address     || '',
      city:     user.city        || '',
      zipCode:  user.zipCode     || '',
      phone:    user.phone       || '',
    }));
  }, [user]);

  useEffect(() => { if (onlyCourses && step === 'shipping') setStep('payment'); }, [onlyCourses]);

  useEffect(() => {
    api.get('/site-settings')
      .then((res: any) => { if (res?.bkash_number) setSiteSettings(res); })
      .catch(() => {});
  }, []);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) { toast.error('Please enter a promo code'); return; }
    const found = MOCK_PROMO_CODES.find(p => p.code.toUpperCase() === promoCode.trim().toUpperCase());
    if (found) {
      const amount = found.type === 'fixed' ? found.discount : totalPrice * found.discount;
      setAppliedDiscount({ code: found.code, amount });
      toast.success(`Promo code ${found.code} applied!`);
    } else toast.error('Invalid promo code');
  };

  const paymentDiscount = (() => {
    if (paymentMethod === 'bkash' && siteSettings?.bkash_discount_percent)
      return (totalPrice - (appliedDiscount?.amount||0)) * (siteSettings.bkash_discount_percent/100);
    if (paymentMethod === 'nagad' && siteSettings?.nagad_discount_percent)
      return (totalPrice - (appliedDiscount?.amount||0)) * (siteSettings.nagad_discount_percent/100);
    return 0;
  })();
  const codCharge   = paymentMethod === 'cod' && siteSettings?.cod_charge ? Number(siteSettings.cod_charge) : 0;
  const finalTotal  = totalPrice - (appliedDiscount?.amount||0) - paymentDiscount + codCharge;

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/auth'); return; }
    if ((paymentMethod==='bkash'||paymentMethod==='nagad') && (!paymentDetails.mobileNumber||!paymentDetails.transactionId)) {
      toast.error('Please enter mobile number and transaction ID'); return;
    }
    setLoading(true);
    const hasOnlyCourses = cart.every(i => i.type === 'course');
    const orderPayload = {
      payment_method: paymentMethod,
      payment_mobile: (paymentMethod==='bkash'||paymentMethod==='nagad') ? paymentDetails.mobileNumber : null,
      transaction_id: (paymentMethod==='bkash'||paymentMethod==='nagad') ? paymentDetails.transactionId : null,
      discount_amount: paymentDiscount,
      cod_charge: codCharge,
      items: cart.map(item => ({
        type: item.type,
        book_id: item.type === 'book' && item.bookId ? parseInt(item.bookId) : null,
        course_id: item.type === 'course' && item.courseId ? parseInt(item.courseId) : null,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      ...(hasOnlyCourses ? {
        // Course-only order: minimal required fields
        shipping_address: 'N/A - Course Enrollment',
        city: 'N/A',
        phone: (user as any).phone || '0000000000',
      } : {
        // Mixed order: include shipping details
        shipping_address: shippingData.address,
        city: shippingData.city,
        state: (shippingData as any).state || 'N/A',
        postal_code: shippingData.zipCode,
        phone: shippingData.phone,
      }),
    };
    try {
      const token = localStorage.getItem('auth_token');
      const res   = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message||'Failed to place order'); setLoading(false); return; }
      if (data.order?.order_number) setOrderNumber(data.order.order_number);
      else if (data.order?.id)      setOrderNumber(`ORD-${data.order.id}`);
    } catch {}
    setTimeout(() => {
      const orderId = orderNumber || generateOrderNumber();
      const existing = JSON.parse(localStorage.getItem('lumina_orders')||'[]');
      localStorage.setItem('lumina_orders', JSON.stringify([{
        id: orderId, userId: user.uid, items: cart, total: finalTotal,
        status: hasOnlyCourses ? 'completed' : 'pending',
        paymentMethod, shippingAddress: hasOnlyCourses ? null : shippingData,
        createdAt: new Date().toISOString(), discount: appliedDiscount,
      }, ...existing]));
      clearCart(); setStep('success');
      try { window.dispatchEvent(new Event('orders-changed')); } catch {}
      setLoading(false);
    }, 1600);
  };

  /* ── Empty cart ── */
  if (cart.length === 0 && step !== 'success') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 text-center gap-8">
      <div className="w-24 h-24 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-100">
        <ShoppingBag className="w-11 h-11 text-orange-400" />
      </div>
      <div>
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-400">Add some items before checking out.</p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/shop" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:opacity-90 transition-all">
          <BookOpen className="w-4 h-4" /> Browse Books
        </Link>
        <Link href="/courses" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all">
          <GraduationCap className="w-4 h-4" /> Browse Courses
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">

      {/* ── Step bar ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <StepBar step={step} />
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ════ SHIPPING ════ */}
        {!onlyCourses && step === 'shipping' && (
          <motion.div key="shipping"
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-8 space-y-6">
              {/* Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="p-8 space-y-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-100">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-gray-900">Shipping Information</h2>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      Profile Linked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Read-only */}
                    {[
                      { label: 'Full Name',      value: shippingData.fullName, icon: null },
                      { label: 'Email Address',  value: shippingData.email,    icon: null },
                    ].map(f => (
                      <div key={f.label}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <div className="relative">
                          <input type="text" value={f.value} readOnly className={inputReadonly} />
                          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                        </div>
                      </div>
                    ))}

                    {/* Address */}
                    <div className="md:col-span-2">
                      <FieldLabel>Street Address</FieldLabel>
                      <input type="text" value={shippingData.address}
                        onChange={e => setShippingData(p => ({...p, address: e.target.value}))}
                        placeholder="House no, Road, Area…"
                        className={inputEditable} />
                    </div>

                    <div>
                      <FieldLabel>City</FieldLabel>
                      <input type="text" value={shippingData.city}
                        onChange={e => setShippingData(p => ({...p, city: e.target.value}))}
                        placeholder="Dhaka"
                        className={inputEditable} />
                    </div>

                    <div>
                      <FieldLabel>Zip Code</FieldLabel>
                      <input type="text" value={shippingData.zipCode}
                        onChange={e => setShippingData(p => ({...p, zipCode: e.target.value}))}
                        placeholder="1200"
                        className={inputEditable} />
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel>Phone Number</FieldLabel>
                      <input type="tel" value={shippingData.phone}
                        onChange={e => setShippingData(p => ({...p, phone: e.target.value.replace(/\D/g,'').slice(0,11)}))}
                        placeholder="01XXXXXXXXX" maxLength={11}
                        className={inputEditable} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Cart
                </Link>
                <button
                  onClick={() => {
                    if (!shippingData.address||!shippingData.city||!shippingData.zipCode||!shippingData.phone)
                      { toast.error('Please fill all shipping details'); return; }
                    if (shippingData.phone.length < 11)
                      { toast.error('Please enter a valid 11-digit phone number'); return; }
                    setStep('payment');
                  }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500
                    text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all
                    shadow-xl shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 group">
                  Continue to Payment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <OrderSummary {...{ cart, totalPrice, promoCode, setPromoCode, handleApplyPromo, appliedDiscount, finalTotal, paymentMethod, siteSettings }} />
            </div>
          </motion.div>
        )}

        {/* ════ PAYMENT ════ */}
        {step === 'payment' && (
          <motion.div key="payment"
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="p-8 space-y-8">

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-100">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900">Payment Method</h2>
                  </div>

                  {/* Course-only notice */}
                  {onlyCourses && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                      <GraduationCap className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-orange-700 leading-relaxed">
                        Course enrollment — no shipping required. Access will be available immediately after payment confirmation.
                      </p>
                    </div>
                  )}

                  {/* Payment options */}
                  <div className="space-y-3">
                    {[
                      { id:'bkash',  label:'bKash',           icon: Phone,  desc:'Pay via bKash mobile wallet',   color:'pink' },
                      { id:'nagad',  label:'Nagad',            icon: Phone,  desc:'Pay via Nagad mobile wallet',   color:'orange' },
                      ...(!onlyCourses ? [{ id:'cod', label:'Cash on Delivery', icon: Truck, desc:'Pay when you receive your books', color:'gray' }] : []),
                    ].map(m => {
                      const active = paymentMethod === m.id;
                      return (
                        <button key={m.id} onClick={() => setPaymentMethod(m.id as any)}
                          className={cn(
                            'w-full flex items-center gap-5 p-5 rounded-2xl border-2 transition-all text-left group',
                            active ? 'border-orange-500 bg-orange-50/40 shadow-lg shadow-orange-50'
                                   : 'border-gray-100 hover:border-orange-200 hover:shadow-md'
                          )}>
                          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all border',
                            active ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200'
                                   : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:border-orange-100 group-hover:bg-orange-50 group-hover:text-orange-400')}>
                            <m.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                            {/* Discount badge */}
                            {m.id==='bkash' && siteSettings?.bkash_discount_percent > 0 && (
                              <span className="inline-block mt-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                {siteSettings.bkash_discount_percent}% off
                              </span>
                            )}
                            {m.id==='nagad' && siteSettings?.nagad_discount_percent > 0 && (
                              <span className="inline-block mt-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                {siteSettings.nagad_discount_percent}% off
                              </span>
                            )}
                          </div>
                          {/* Radio */}
                          <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                            active ? 'border-orange-500' : 'border-gray-200 group-hover:border-orange-200')}>
                            {active && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile payment details */}
                  {(paymentMethod==='bkash'||paymentMethod==='nagad') && (
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 overflow-hidden">
                      {/* Instructions header */}
                      <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
                        <p className="text-sm text-orange-800 leading-relaxed">
                          <span className="font-bold">Step 1:</span> Send{' '}
                          <span className="font-extrabold text-orange-600">৳{finalTotal.toFixed(2)}</span> to our{' '}
                          <span className="font-bold">{paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}</span> number{' '}
                          <span className="font-extrabold text-orange-600 text-base">
                            {paymentMethod==='bkash' ? (siteSettings?.bkash_number||'01XXXXXXXXX') : (siteSettings?.nagad_number||'01XXXXXXXXX')}
                          </span>
                          . Then fill in the details below.
                        </p>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <FieldLabel>Your {paymentMethod==='bkash'?'bKash':'Nagad'} Number</FieldLabel>
                          <input type="tel" placeholder="01XXXXXXXXX"
                            value={paymentDetails.mobileNumber}
                            onChange={e => setPaymentDetails(p => ({...p, mobileNumber: e.target.value}))}
                            className={inputEditable} />
                        </div>
                        <div>
                          <FieldLabel>Transaction ID</FieldLabel>
                          <input type="text" placeholder="e.g. 8QZ1ABC2DEF"
                            value={paymentDetails.transactionId}
                            onChange={e => setPaymentDetails(p => ({...p, transactionId: e.target.value}))}
                            className={inputEditable} />
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          You'll receive a confirmation once the payment is verified.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                {!onlyCourses ? (
                  <button onClick={() => setStep('shipping')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Shipping
                  </button>
                ) : (
                  <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Cart
                  </Link>
                )}
                <button onClick={handlePlaceOrder} disabled={loading}
                  className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-500
                    text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all
                    shadow-xl shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 group">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Place Order <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <OrderSummary {...{ cart, totalPrice, promoCode, setPromoCode, handleApplyPromo, appliedDiscount, finalTotal, paymentMethod, siteSettings }} />
            </div>
          </motion.div>
        )}

        {/* ════ SUCCESS ════ */}
        {step === 'success' && (
          <motion.div key="success"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
            className="max-w-xl mx-auto text-center py-12 space-y-8">

            {/* Icon */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-xl shadow-emerald-100/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            <div>
              <h1 className="font-serif text-5xl font-bold text-gray-900 mb-3">
                {onlyCourses ? 'Enrollment Confirmed!' : 'Order Confirmed!'}
              </h1>
              <p className="text-gray-400 leading-relaxed">
                {onlyCourses
                  ? `Thank you for enrolling. You now have access to your courses.`
                  : `Thank you for your purchase. We've sent a confirmation to`}{' '}
                {shippingData.email && <span className="font-semibold text-gray-700">{shippingData.email}</span>}
              </p>
            </div>

            {/* Order details card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden text-left">
              <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
              <div className="p-7 space-y-4">
                {[
                  { label: 'Order Number', value: orderNumber || generateOrderNumber(), accent: false },
                  { label: onlyCourses ? 'Access' : 'Estimated Delivery',
                    value: onlyCourses ? 'Available Now' : '3–5 Business Days',
                    accent: onlyCourses },
                  { label: 'Total Paid', value: `৳${finalTotal.toFixed(2)}`, accent: false },
                  { label: 'Payment Method', value: paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Cash on Delivery', accent: false },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{row.label}</span>
                    <span className={cn('text-sm font-bold', row.accent ? 'text-emerald-600' : 'text-gray-900')}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/profile"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all">
                View Order History
              </Link>
              <Link href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500
                  text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-orange-200">
                <BookOpen className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Order Summary sidebar ──────────────────────────────────────── */
function OrderSummary({ cart, totalPrice, promoCode, setPromoCode, handleApplyPromo,
  appliedDiscount, finalTotal, paymentMethod, siteSettings,
}: {
  cart: any[]; totalPrice: number; promoCode: string;
  setPromoCode: (v:string)=>void; handleApplyPromo:()=>void;
  appliedDiscount:{code:string;amount:number}|null;
  finalTotal:number; paymentMethod:string; siteSettings:any;
}) {
  const paymentDiscount = (() => {
    if (paymentMethod==='bkash' && siteSettings?.bkash_discount_percent)
      return (totalPrice-(appliedDiscount?.amount||0))*(siteSettings.bkash_discount_percent/100);
    if (paymentMethod==='nagad' && siteSettings?.nagad_discount_percent)
      return (totalPrice-(appliedDiscount?.amount||0))*(siteSettings.nagad_discount_percent/100);
    return 0;
  })();
  const codCharge = paymentMethod==='cod' && siteSettings?.cod_charge ? Number(siteSettings.cod_charge) : 0;

  return (
    <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100/60 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
      <div className="p-7 space-y-7">
        <h3 className="font-serif text-xl font-bold text-gray-900">Order Summary</h3>

        {/* Item list */}
        <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
          {cart.map(item => (
            <div key={item.bookId||item.courseId} className="flex gap-3.5 group">
              <div className="relative w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                {item.coverUrl
                  ? <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-orange-300" />
                    </div>}
                {item.type==='course' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/75 to-amber-400/75 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{item.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                {item.type==='course' && (
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wide inline-block mt-1">
                    Course
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900 flex-shrink-0">৳{(item.price*item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div>
          <FieldLabel>Promo Code</FieldLabel>
          <div className="flex gap-2">
            <input type="text" placeholder="Enter code" value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-300
                focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 hover:border-gray-300 transition-all" />
            <button onClick={handleApplyPromo}
              className="px-4 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all whitespace-nowrap">
              Apply
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2.5 pt-5 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-gray-900">৳{totalPrice.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Promo ({appliedDiscount.code})</span>
              <span className="font-bold">-৳{appliedDiscount.amount.toFixed(2)}</span>
            </div>
          )}
          {paymentDiscount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> {paymentMethod==='bkash'?'bKash':'Nagad'} Discount</span>
              <span className="font-bold">-৳{paymentDiscount.toFixed(2)}</span>
            </div>
          )}
          {codCharge > 0 && (
            <div className="flex justify-between text-sm text-orange-600">
              <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> COD Charge</span>
              <span className="font-bold">+৳{codCharge.toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</p>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">৳{finalTotal.toFixed(2)}</p>
              </div>
              <span className="text-xs text-gray-400 font-medium pb-1">BDT</span>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-around pt-2">
            {[
              { icon: ShieldCheck, label: 'Secure' },
              { icon: RefreshCw,   label: 'Returns' },
              { icon: Lock,        label: 'Encrypted' },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <t.icon className="w-3.5 h-3.5 text-emerald-500" /> {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}