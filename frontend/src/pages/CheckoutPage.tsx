import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, CreditCard, Truck } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatPrice } from '../lib/utils';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = cartTotal >= 500 ? 0 : 25;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-medium mb-4">Your bag is empty</h1>
        <Link to="/category/all" className="text-amber-600 underline">Continue shopping</Link>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="pt-32 pb-20 bg-neutral-50 min-h-screen">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-4">Order Confirmed</h1>
          <p className="text-neutral-600 mb-6">
            Thank you for your purchase. We\'ve sent a confirmation to your email and will notify you once your order ships.
          </p>
          <div className="bg-white rounded-xl p-6 mb-8 text-left">
            <p className="text-sm text-neutral-500 mb-1">Order number</p>
            <p className="text-lg font-medium text-neutral-900 mb-4">SH-250118-7782</p>
            <p className="text-sm text-neutral-500 mb-1">Estimated delivery</p>
            <p className="font-medium text-neutral-900">January 25 — January 28, 2025</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/account?tab=orders" className="px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition">
              Track Order
            </Link>
            <Link to="/" className="px-8 py-3 border border-neutral-900 text-neutral-900 rounded-full font-medium hover:bg-neutral-900 hover:text-white transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-8">Secure Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10 max-w-2xl">
          {['Shipping', 'Payment', 'Review'].map((label, idx) => {
            const currentStep = ['shipping', 'payment', 'review'].indexOf(step);
            const isActive = idx <= currentStep;
            return (
              <div key={label} className="flex items-center gap-4 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {isActive && idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`hidden sm:block text-sm font-medium ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>{label}</span>
                {idx < 2 && <div className={`flex-1 h-0.5 ${idx < currentStep ? 'bg-neutral-900' : 'bg-neutral-200'}`} />}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            {step === 'shipping' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-medium mb-6 flex items-center gap-2"><Truck className="w-5 h-5" /> Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input placeholder="First name" className="input-field" />
                  <input placeholder="Last name" className="input-field" />
                </div>
                <input placeholder="Street address" className="input-field mb-4" />
                <input placeholder="Apartment, suite, etc. (optional)" className="input-field mb-4" />
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <input placeholder="City" className="input-field" />
                  <input placeholder="Postal code" className="input-field" />
                  <select className="input-field">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                <button onClick={() => setStep('payment')} className="w-full py-3.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Payment */}
            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-medium mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
                <div className="border border-neutral-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-6 bg-neutral-900 rounded" />
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <input placeholder="Card number" className="input-field mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input placeholder="MM / YY" className="input-field" />
                    <input placeholder="CVC" className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')} className="flex-1 py-3.5 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50 transition">
                    Back
                  </button>
                  <button onClick={() => setStep('review')} className="flex-1 py-3.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review */}
            {step === 'review' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-medium mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex gap-4">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-neutral-100" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity} • {item.color}{item.size ? ` / ${item.size}` : ''}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="flex-1 py-3.5 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50 transition">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 py-3.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2"
                  >
                    {processing ? 'Processing...' : <><Lock className="w-4 h-4" /> Place Order</>}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-medium mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex justify-between text-neutral-600">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-neutral-100 pt-3 flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-neutral-100 pt-3 flex justify-between font-semibold text-neutral-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Lock className="w-3.5 h-3.5" /> SSL encrypted & secure checkout
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
