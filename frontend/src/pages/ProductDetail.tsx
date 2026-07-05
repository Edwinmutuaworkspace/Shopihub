import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Share2,
  ChevronRight,
  Star,
  Minus,
  Plus
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts, getReviewsByProduct, products } from '../lib/data';
import { useStore } from '../lib/store';
import { formatPrice } from '../lib/utils';
import StarRating from '../components/UI/StarRating';
import ProductCard from '../components/UI/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => (slug ? getProductBySlug(slug) : undefined), [slug]);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  if (!product) {
    return (
      <main className="pt-36 pb-20 text-center">
        <h1 className="text-2xl font-medium">Product not found</h1>
        <Link to="/" className="text-amber-600 mt-4 inline-block">Return home</Link>
      </main>
    );
  }

  const related = getRelatedProducts(product.id, 4);
  const productReviews = getReviewsByProduct(product.id);
  const liked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      color: selectedColor,
      size: product.sizes ? selectedSize : undefined
    });
  };

  const handleBuyNow = () => {
    if (product?.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <main className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${product.category}`} className="capitalize hover:text-neutral-900">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden bg-neutral-100 border-2 transition ${
                    selectedImage === idx ? 'border-neutral-900' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:py-6">
            <p className="text-sm text-amber-600 uppercase tracking-wider font-medium mb-2">{product.brand}</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} count={product.reviewCount} />
              <span className="text-sm text-neutral-400">|</span>
              <span className="text-sm text-neutral-500">{product.reviewCount} reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-semibold text-neutral-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.isSale && product.originalPrice && (
                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase rounded-full">
                  Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-neutral-600 leading-relaxed mb-8">{product.description}</p>

            {/* Color */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Color: <span className="text-neutral-500">{selectedColor}</span></p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition ${
                      selectedColor === color.name ? 'border-neutral-900' : 'border-transparent'
                    }`}
                    aria-label={color.name}
                  >
                    <span className="w-7 h-7 rounded-full border border-neutral-200" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            {product.sizes && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Size: <span className="text-neutral-500">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-3 py-2 rounded-lg border text-sm font-medium transition ${
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-neutral-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-neutral-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-neutral-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white py-3.5 rounded-lg font-medium hover:bg-neutral-800 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center bg-amber-500 text-white py-3.5 rounded-lg font-medium hover:bg-amber-600 transition"
              >
                Buy It Now
              </button>
              <button
                onClick={() => liked ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-12 h-12 rounded-lg border flex items-center justify-center transition ${
                  liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-neutral-100 mb-6">
              {[
                { icon: Truck, label: 'Free shipping over $500' },
                { icon: ShieldCheck, label: '2-year warranty' },
                { icon: RefreshCw, label: '30-day returns' }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-neutral-600" />
                  <p className="text-xs text-neutral-500">{item.label}</p>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition">
              <Share2 className="w-4 h-4" /> Share this product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-8 border-b border-neutral-200 mb-8">
            {(['description', 'reviews', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium capitalize transition border-b-2 ${
                  activeTab === tab ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <h3 className="text-xl font-medium mb-4">Product Details</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">{product.description}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-serif font-bold text-neutral-900">{product.rating}</div>
                <div>
                  <StarRating rating={product.rating} count={product.reviewCount} />
                  <p className="text-sm text-neutral-500 mt-1">Based on {product.reviewCount} reviews</p>
                </div>
              </div>
              <div className="space-y-6">
                {productReviews.length > 0 ? productReviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-100 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-sm">{review.author}</p>
                        <p className="text-xs text-neutral-500">{review.date} {review.verified && '• Verified Purchase'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500' : 'text-neutral-200'}`} fill="currentColor" />
                      ))}
                    </div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-sm text-neutral-600">{review.body}</p>
                  </div>
                )) : (
                  <p className="text-neutral-500">No reviews yet. Be the first to review this product.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl text-neutral-600 leading-relaxed">
              <p className="mb-4">
                We offer complimentary standard shipping on all orders over $500. Orders are processed within 1-2 business days and delivered within 3-7 business days depending on your location.
              </p>
              <p className="mb-4">
                Express and overnight options are available at checkout. International shipping is available to over 60 countries with duties calculated at checkout.
              </p>
              <p>
                Every order is fully insured and ships in signature ShopiHub packaging. If you are not completely satisfied, returns are accepted within 30 days of delivery.
              </p>
            </motion.div>
          )}
        </div>

        {/* Related products */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {related.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
