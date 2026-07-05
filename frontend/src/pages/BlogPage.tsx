import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { blogPosts } from '../lib/data';

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <main className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-2">The Journal</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 mb-4">Stories & Style Notes</h1>
          <p className="text-neutral-500">Curated reads on design, craftsmanship, and the art of living well.</p>
        </div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Link to={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">{featured.category}</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-3 mb-4 group-hover:text-amber-700 transition">
                {featured.title}
              </h2>
              <p className="text-neutral-600 text-lg mb-6 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>{featured.author}</span>
                <span>•</span>
                <span>{featured.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readTime}</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-xl mb-5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="text-amber-600 text-xs font-medium uppercase tracking-wider">{post.category}</span>
                <h3 className="text-xl font-serif font-bold text-neutral-900 mt-2 mb-2 group-hover:text-amber-700 transition">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 group-hover:text-amber-700 transition">
                  Read article <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
