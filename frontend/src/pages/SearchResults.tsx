import { useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { searchProducts } from '../lib/data';
import ProductCard from '../components/UI/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = useMemo(() => searchProducts(query), [query]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <main className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-2">
          Search Results
        </h1>
        <p className="text-neutral-500 mb-8">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl">
            <Search className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-neutral-900 mb-2">No matches found</h2>
            <p className="text-neutral-500 mb-6">Try a different keyword or browse our collections.</p>
            <Link to="/category/all" className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition">
              Browse All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {results.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
