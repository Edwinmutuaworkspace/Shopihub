import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-8xl font-serif font-bold text-neutral-200 mb-4">404</p>
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-4">Page not found</h1>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          The page you are looking for doesn\'t exist or has been moved. Let\'s get you back on track.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </main>
  );
}
