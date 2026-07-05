import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, CreditCard, LogOut } from 'lucide-react';
import { currentUser } from '../lib/data';
import { useStore } from '../lib/store';
import { formatPrice, formatDate } from '../lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard }
];

const statusStyles: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { wishlist } = useStore();

  useEffect(() => {
    const tab = searchParams.get('tab') || 'profile';
    if (tabs.some((t) => t.id === tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <main className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <aside className="bg-white rounded-xl p-4 lg:p-6">
            <div className="flex items-center gap-4 mb-8">
              <img src={currentUser.avatar} alt={currentUser.firstName} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <p className="font-medium text-neutral-900">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-xs text-neutral-500">{currentUser.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </nav>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition mt-4">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-medium mb-6">Profile Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">First Name</label>
                    <input defaultValue={currentUser.firstName} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Last Name</label>
                    <input defaultValue={currentUser.lastName} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Email</label>
                    <input defaultValue={currentUser.email} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Phone</label>
                    <input defaultValue={currentUser.phone} className="input-field" />
                  </div>
                </div>
                <button className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {currentUser.orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-neutral-500">Order {order.id}</p>
                        <p className="text-sm text-neutral-500">Placed on {formatDate(order.date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover bg-neutral-100" />
                          <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-neutral-500">Qty: {item.quantity} • {item.color}{item.size ? ` / ${item.size}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                      <div>
                        <p className="text-sm text-neutral-500">Total: <span className="font-medium text-neutral-900">{formatPrice(order.total)}</span></p>
                        <p className="text-xs text-neutral-400">Tracking: {order.trackingNumber}</p>
                      </div>
                      <Link
                        to={`/order-tracking?order=${order.id}`}
                        className="px-5 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition text-center"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl p-6 sm:p-8 text-center">
                <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-4">You have {wishlist.length} items in your wishlist.</p>
                <Link to="/wishlist" className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition">
                  View Wishlist
                </Link>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {currentUser.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">{addr.firstName} {addr.lastName}</p>
                        <p className="text-sm text-neutral-600 mt-1">{addr.address1}</p>
                        {addr.address2 && <p className="text-sm text-neutral-600">{addr.address2}</p>}
                        <p className="text-sm text-neutral-600">{addr.city}, {addr.postalCode}</p>
                        <p className="text-sm text-neutral-600">{addr.country}</p>
                        <p className="text-sm text-neutral-500 mt-2">{addr.phone}</p>
                      </div>
                      <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded">Default</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border border-dashed border-neutral-300 rounded-xl text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition">
                  + Add New Address
                </button>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-medium mb-6">Saved Payment Methods</h2>
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-6 bg-neutral-900 rounded" />
                    <div>
                      <p className="font-medium text-sm">Visa ending in 4242</p>
                      <p className="text-xs text-neutral-500">Expires 12/27</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded">Default</span>
                </div>
                <button className="px-6 py-2.5 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition">
                  + Add Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
