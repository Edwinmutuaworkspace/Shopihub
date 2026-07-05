import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../lib/data';

export default function FeaturedCollections() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-2">Curated Categories</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">Shop by Collection</h2>
          </div>
          <Link to="/category/all" className="text-sm font-medium text-neutral-900 flex items-center gap-1 hover:text-amber-700 transition">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link to={`/category/${cat.slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/5]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 text-white">
                  <h3 className="text-xl lg:text-2xl font-serif font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/80 mb-3 line-clamp-2">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider border-b border-white/50 pb-0.5">
                    Explore {cat.itemCount} items
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
