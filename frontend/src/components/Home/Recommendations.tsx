import { useStore } from '../../lib/store';
import { products } from '../../lib/data';
import ProductCard from '../UI/ProductCard';

export default function Recommendations() {
  const { wishlist, cart } = useStore();
  const interactedIds = new Set([...wishlist.map((p) => p.id), ...cart.map((i) => i.product.id)]);
  const recommended = products.filter((p) => !interactedIds.has(p.id)).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-2">Picked For You</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-4">Personalized Recommendations</h2>
          <p className="text-neutral-500">Based on your browsing style and current favorites.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {recommended.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
