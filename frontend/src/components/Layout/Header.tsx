import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';
import { categories } from '../../lib/data';

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div className="bg-neutral-900 text-white text-xs py-2.5 text-center tracking-wide">
          Complimentary shipping on orders over $500 • Extended returns through January 31
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-900"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">S</span>
              </div>
              <span className={`text-xl font-serif font-bold tracking-tight ${isScrolled ? 'text-neutral-900' : 'text-neutral-900 lg:text-white'}`}>
                ShopiHub
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className={`text-sm font-medium tracking-wide hover:opacity-70 transition ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button className={`flex items-center gap-1 text-sm font-medium tracking-wide hover:opacity-70 transition ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                  Shop <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {shopDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    >
                      <div className="bg-white shadow-xl rounded-xl p-6 w-[640px] grid grid-cols-3 gap-6 border border-neutral-100">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            className="group"
                          >
                            <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                            </div>
                            <p className="font-medium text-neutral-900">{cat.name}</p>
                            <p className="text-xs text-neutral-500 mt-1">{cat.itemCount} items</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/blog" className={`text-sm font-medium tracking-wide hover:opacity-70 transition ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                Journal
              </Link>
              <Link to="/account" className={`text-sm font-medium tracking-wide hover:opacity-70 transition ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
                Account
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 transition ${isScrolled ? 'text-neutral-900' : 'text-neutral-900 lg:text-white'}`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {searchOpen && (
                    <motion.form
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 280 }}
                      exit={{ opacity: 0, width: 0 }}
                      onSubmit={handleSearch}
                      className="absolute right-0 top-full mt-2 overflow-hidden"
                    >
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-neutral-900 shadow-lg"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/account"
                className={`hidden sm:block p-2 transition ${isScrolled ? 'text-neutral-900' : 'text-neutral-900 lg:text-white'}`}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                to="/wishlist"
                className={`hidden sm:block p-2 transition relative ${isScrolled ? 'text-neutral-900' : 'text-neutral-900 lg:text-white'}`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className={`p-2 transition relative ${isScrolled ? 'text-neutral-900' : 'text-neutral-900 lg:text-white'}`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xl font-serif font-bold">ShopiHub</span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-5">
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 rounded-lg text-sm"
                  />
                </form>
                <nav className="space-y-1">
                  <Link to="/" className="block px-3 py-3 text-lg font-medium">Home</Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-3 py-3 text-lg font-medium text-neutral-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link to="/blog" className="block px-3 py-3 text-lg font-medium">Journal</Link>
                  <Link to="/account" className="block px-3 py-3 text-lg font-medium">My Account</Link>
                  <Link to="/wishlist" className="block px-3 py-3 text-lg font-medium">Wishlist ({wishlist.length})</Link>
                  <Link to="/cart" className="block px-3 py-3 text-lg font-medium">Shopping Bag ({cartCount})</Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
