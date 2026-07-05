import { useState } from 'react';
import { motion } from 'framer-motion';
import { products } from '../../lib/data';
import ProductCard from '../UI/ProductCard';

const tabs = ['All', 'Fashion', 'Watches', 'Home', 'Beauty'];

export default function BestSellers() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All'
    ? products.filter((p) => p.isBestseller)
    : products.filter((p) => p.isBestseller && p.category.toLowerCase() === active.toLowerCase());

  return (
    <section className="py-20 lg:py-28 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400 mb-2">Customer Favorites</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">Best Sellers</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  active === tab
                    ? 'bg-white text-neutral-900'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
