import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      {/* Newsletter */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">Join the inner circle</h3>
              <p className="text-neutral-400 max-w-md">
                Be the first to access new arrivals, private sales, and curated style stories delivered to your inbox.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-neutral-900 font-serif text-lg font-bold">S</span>
              </div>
              <span className="text-lg font-serif font-bold text-white">ShopiHub</span>
            </Link>
            <p className="text-sm text-neutral-400 mb-6 max-w-xs">
              A curated destination for luxury fashion, fine objects, and everyday elevated living.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/category/fashion" className="hover:text-white transition">Designer Fashion</Link></li>
              <li><Link to="/category/watches" className="hover:text-white transition">Luxury Watches</Link></li>
              <li><Link to="/category/jewelry" className="hover:text-white transition">Fine Jewelry</Link></li>
              <li><Link to="/category/home" className="hover:text-white transition">Home Interiors</Link></li>
              <li><Link to="/category/beauty" className="hover:text-white transition">Beauty & Fragrance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/account" className="hover:text-white transition">My Account</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-white transition">Order Tracking</Link></li>
              <li><Link to="#" className="hover:text-white transition">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-white transition">Size Guide</Link></li>
              <li><Link to="#" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-white transition">About ShopiHub</Link></li>
              <li><Link to="#" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition">Sustainability</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Journal</Link></li>
              <li><Link to="#" className="hover:text-white transition">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-neutral-500" />
                <span>1842 Rosewood Avenue<br />Los Angeles, CA 90048</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-500" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-500" />
                <span>concierge@shopihub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} ShopiHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
