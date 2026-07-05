import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { products } from '../../lib/data';
import ProductCard from '../UI/ProductCard';
import Countdown from '../UI/Countdown';

export default function FlashSales() {
  const saleProducts = products.filter((p) => p.isSale).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-600" fill="currentColor" />
              <p className="text-sm uppercase tracking-[0.2em] text-amber-600">Limited Time</p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">Flash Sale</h2>
            <p className="text-neutral-500 mt-2">Up to 30% off on select premium pieces. Ends soon.</p>
          </div>
          <Countdown targetHours={8} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {saleProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/category/all?sale=true"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition"
          >
            Shop All Sale
          </Link>
        </div>
      </div>
    </section>
  );
}
