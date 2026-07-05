import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '../../lib/data';

export default function BlogPreview() {
  return (
    <section className="py-20 lg:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-2">The Journal</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">Stories & Style Notes</h2>
          </div>
          <Link to="/blog" className="text-sm font-medium text-neutral-900 flex items-center gap-1 hover:text-amber-700 transition">
            Read All Articles <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-xl mb-5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                  <span className="text-amber-600 font-medium">{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-900 group-hover:text-amber-700 transition mb-2">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
