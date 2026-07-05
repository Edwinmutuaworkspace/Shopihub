import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { blogPosts } from '../lib/data';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <main className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">{post.category}</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 mt-3 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-10">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 mb-12">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <article className="prose prose-neutral max-w-none">
            <p className="text-lg leading-relaxed text-neutral-700 mb-6">{post.excerpt}</p>
            <p className="leading-relaxed text-neutral-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4">The Details That Matter</h2>
            <p className="leading-relaxed text-neutral-600 mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="leading-relaxed text-neutral-600 mb-6">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <blockquote className="border-l-4 border-amber-500 pl-6 italic text-neutral-700 my-8">
              "True luxury is found in the quiet confidence of exceptional craftsmanship and timeless design."
            </blockquote>
            <p className="leading-relaxed text-neutral-600">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </article>
        </motion.div>
      </div>
    </main>
  );
}
