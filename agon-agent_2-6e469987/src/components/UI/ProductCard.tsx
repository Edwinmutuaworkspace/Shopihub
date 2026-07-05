import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';
import { useStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const liked = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      color: product.colors[0]?.name || 'Default'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 mb-4">
          <img
            src={product.images[imageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold uppercase tracking-wider rounded-full">
              {product.badge}
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              liked ? 'bg-red-50 text-red-500' : 'bg-white/90 text-neutral-700 opacity-0 group-hover:opacity-100'
            }`}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
          </button>

          {/* Quick actions */}
          <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-neutral-900 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-900 hover:text-white transition"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 bg-white text-neutral-900 rounded-lg flex items-center justify-center hover:bg-neutral-900 hover:text-white transition"
              aria-label="Buy Now"
              title="Buy Now"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Image dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 py-3 opacity-0 group-hover:opacity-100 transition">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setImageIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition ${imageIndex === idx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-1.5">
        <p className="text-xs text-neutral-500 uppercase tracking-wide">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-neutral-900 group-hover:text-amber-700 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} size={12} />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
