import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatPrice } from '../lib/utils';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useStore();
  const navigate = useNavigate();

  const shipping = cartTotal >= 500 ? 0 : 25;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <main className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-8">Shopping Bag ({cartCount})</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-7 h-7 text-neutral-500" />
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">Your bag is empty</h2>
            <p className="text-neutral-500 mb-6">Discover our curated collections and find something extraordinary.</p>
            <Link to="/category/all" className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <motion.div
                  key={`${item.product.id}-${item.color}-${item.size}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-4 sm:p-6 flex gap-5"
                >
                  <Link to={`/product/${item.product.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">{item.product.brand}</p>
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="font-medium text-neutral-900 truncate">{item.product.name}</h3>
                    </Link>
                    <p className="text-sm text-neutral-500 mt-1">
                      {item.color}{item.size ? ` / ${item.size}` : ''}
                    </p>
                  </div>
                  <p className="font-semibold text-neutral-900">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-neutral-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-neutral-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.color, item.size)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-6 sticky top-28">
              <h2 className="text-lg font-medium text-neutral-900 mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-neutral-100 pt-3 flex justify-between font-semibold text-neutral-900 text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition mb-3"
              >
                Proceed to Checkout
              </button>
              <Link to="/category/all" className="block text-center text-sm text-neutral-600 hover:text-neutral-900 underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
