import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../lib/store';
import ProductCard from '../components/UI/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <main className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-8">Your Wishlist ({wishlist.length})</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart className="w-7 h-7 text-neutral-400" />
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">Nothing saved yet</h2>
            <p className="text-neutral-500 mb-6">Tap the heart icon on any product to save it here.</p>
            <Link to="/category/all" className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {wishlist.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/category/all"
                className="inline-flex items-center gap-2 px-8 py-3 border border-neutral-900 text-neutral-900 rounded-full font-medium hover:bg-neutral-900 hover:text-white transition"
              >
                <ShoppingBag className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
