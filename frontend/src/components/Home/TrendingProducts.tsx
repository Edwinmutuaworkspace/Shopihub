import { Link } from 'react-router-dom';
import { products } from '../../lib/data';
import ProductCard from '../UI/ProductCard';

export default function TrendingProducts() {
  const trending = products.filter((p) => p.isNew || p.reviewCount > 150).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-2">Most Loved</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-4">Trending Now</h2>
          <p className="text-neutral-500">The pieces our community is adding to their collections this week.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trending.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/category/all"
            className="inline-flex items-center gap-2 text-neutral-900 font-medium border-b border-neutral-900 pb-1 hover:text-amber-700 hover:border-amber-700 transition"
          >
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
}
