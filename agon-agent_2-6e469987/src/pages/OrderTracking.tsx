import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Truck, Package, CheckCircle, MapPin } from 'lucide-react';
import { currentUser } from '../lib/data';
import { formatDate, formatPrice } from '../lib/utils';

const statusSteps = ['processing', 'shipped', 'delivered'];

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [orderId, setOrderId] = useState(initialOrder);
  const [searched, setSearched] = useState(!!initialOrder);

  const order = currentUser.orders.find((o) => o.id === orderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <main className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-4">Track Your Order</h1>
        <p className="text-neutral-500 mb-8">Enter your order number to see the latest status and shipping updates.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. SH-240815-7782"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
            />
          </div>
          <button type="submit" className="px-8 py-3.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">
            Track
          </button>
        </form>

        {searched && order && (
          <div className="bg-white rounded-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm text-neutral-500">Order {order.id}</p>
                <h2 className="text-xl font-medium text-neutral-900">{order.items.length} item{order.items.length > 1 ? 's' : ''}</h2>
              </div>
              <p className="text-sm text-neutral-500">Placed on {formatDate(order.date)}</p>
            </div>

            {/* Progress */}
            <div className="relative mb-10">
              <div className="absolute top-5 left-0 right-0 h-1 bg-neutral-100 -translate-y-1/2" />
              <div className="relative flex justify-between">
                {statusSteps.map((step, idx) => {
                  const currentIdx = statusSteps.indexOf(order.status);
                  const completed = idx <= currentIdx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        completed ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-400'
                      }`}>
                        {step === 'processing' && <Package className="w-4 h-4" />}
                        {step === 'shipped' && <Truck className="w-4 h-4" />}
                        {step === 'delivered' && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <span className={`text-xs font-medium capitalize ${completed ? 'text-neutral-900' : 'text-neutral-400'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-neutral-100" />
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity} • {item.color}{item.size ? ` / ${item.size}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h3>
                <p className="text-sm text-neutral-600">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-sm text-neutral-600">{order.shippingAddress.address1}</p>
                <p className="text-sm text-neutral-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Order Total</h3>
                <p className="text-2xl font-semibold text-neutral-900">{formatPrice(order.total)}</p>
                <p className="text-sm text-neutral-500 mt-1">Tracking: {order.trackingNumber}</p>
              </div>
            </div>
          </div>
        )}

        {searched && !order && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-neutral-500">We couldn\'t find an order with that number.</p>
            <Link to="/account?tab=orders" className="text-amber-600 text-sm mt-3 inline-block">View your orders</Link>
          </div>
        )}
      </div>
    </main>
  );
}
