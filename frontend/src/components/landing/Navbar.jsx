// src/components/landing/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ArrowRight, ShoppingBag, User } from 'lucide-react';
import { logout } from '../../store/authSlice';

const spring = { type: 'spring', stiffness: 300, damping: 25 };

const NAV_LINKS = [
  { name: 'HOME',        href: '/',           isRoute: true },
  { name: 'COLLECTIONS', href: '/categories', isRoute: true },
  { name: 'SHOP',        href: '/shop',        isRoute: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const cartSize = useSelector((s) => s.cart.size);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b-4 border-black z-50 select-none">
      <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <motion.div
            className="w-4 h-4 bg-black border border-white cursor-pointer"
            whileHover={{ rotate: 45 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          />
          <span className="font-inter font-black text-xl md:text-2xl tracking-tighter uppercase">
            ROCKERYXPRINTS
          </span>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-space text-sm font-bold tracking-wider">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="relative py-1 group overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-75 group-hover:text-neutral-500">
                {link.name}
              </span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-100 ease-in-out origin-left" />
            </Link>
          ))}
        </nav>

        {/* Right side — Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-colors duration-75"
            aria-label="Cart"
          >
            <ShoppingBag size={16} />
            {cartSize > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white font-space font-bold text-[10px] flex items-center justify-center border-2 border-white">
                {cartSize > 9 ? '9+' : cartSize}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-white text-black font-space font-bold uppercase text-xs px-4 py-2.5 border-2 border-black hover:bg-black hover:text-white transition-colors duration-75"
            >
              <User size={13} /> DASHBOARD
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-black text-white font-space font-bold uppercase text-xs px-5 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 shadow-solid-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            >
              ENTER SYSTEM
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-100"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="absolute top-19.75 left-0 right-0 bg-white border-b-4 border-black md:hidden shadow-[0_8px_0_0_#000] overflow-hidden"
          >
            <ul className="font-space font-bold uppercase text-sm divide-y-2 divide-black">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 hover:bg-black hover:text-white transition-colors duration-75"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-black hover:text-white transition-colors duration-75"
                >
                  CART
                  {cartSize > 0 && (
                    <span className="w-6 h-6 bg-black text-white font-space font-bold text-xs flex items-center justify-center">
                      {cartSize}
                    </span>
                  )}
                </Link>
              </li>

              <li className="p-6 bg-neutral-100">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-black text-white px-5 py-4 border-2 border-black font-bold text-center hover:bg-white hover:text-black transition-colors duration-100"
                    >
                      <User size={14} /> DASHBOARD
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full border-2 border-black px-5 py-3 font-bold text-xs text-center hover:bg-black hover:text-white transition-colors duration-100"
                    >
                      LOGOUT
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-black text-white px-5 py-4 border-2 border-black hover:bg-white hover:text-black font-bold text-center transition-colors duration-100"
                  >
                    ENTER SYSTEM
                    <ArrowRight size={16} />
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
