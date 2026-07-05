import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, LayoutList, X } from 'lucide-react';
import { products, categories } from '../lib/data';
import ProductCard from '../components/UI/ProductCard';
import { classNames } from '../lib/utils';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' }
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const category = slug === 'all' ? null : categories.find((c) => c.slug === slug);
  const showSaleOnly = searchParams.get('sale') === 'true';

  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), []);

  const filtered = useMemo(() => {
    let result = products;
    if (slug && slug !== 'all') {
      result = result.filter((p) => p.category === slug);
    }
    if (showSaleOnly) {
      result = result.filter((p) => p.isSale);
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [slug, showSaleOnly, priceRange, selectedBrands, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <main className="pt-36 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {category ? (
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-10">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
              <p className="text-amber-400 text-sm uppercase tracking-[0.2em] mb-2">Collection</p>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-3">{category.name}</h1>
              <p className="text-white/80 max-w-lg">{category.description}</p>
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <p className="text-amber-600 text-sm uppercase tracking-[0.2em] mb-2">{showSaleOnly ? 'Promotions' : 'All Products'}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 mb-3">
              {showSaleOnly ? 'Sale' : 'Shop All'}
            </h1>
            <p className="text-neutral-500 max-w-xl">
              {showSaleOnly
                ? 'Exceptional pieces at exclusive prices, for a limited time.'
                : 'Browse our complete curation of luxury fashion, jewelry, home, beauty, and tech.'}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-neutral-100 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <p className="text-sm text-neutral-500">{filtered.length} products</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-900"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="hidden sm:flex items-center border border-neutral-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={classNames('p-2', viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={classNames('p-2', viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500')}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-neutral-500 hover:text-neutral-900">Clear all</button>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-medium mb-4">Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-neutral-900"
                />
                <div className="flex justify-between text-sm text-neutral-500 mt-2">
                  <span>$0</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Brands</h4>
                <div className="space-y-2">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-neutral-300 accent-neutral-900"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-500">No products match your filters.</p>
                <button onClick={clearFilters} className="mt-4 text-neutral-900 font-medium underline">Clear filters</button>
              </div>
            ) : (
              <div className={classNames(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8'
                  : 'space-y-6'
              )}>
                {filtered.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {mobileFiltersOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileFiltersOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-medium">Filters</h3>
          <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-8">
          <div>
            <h4 className="text-sm font-medium mb-4">Price Range</h4>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-sm text-neutral-500 mt-2">
              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">Brands</h4>
            <div className="space-y-2">
              {allBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-neutral-300 accent-neutral-900"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="w-full py-3 border border-neutral-900 rounded-lg text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </motion.div>
    </main>
  );
}
