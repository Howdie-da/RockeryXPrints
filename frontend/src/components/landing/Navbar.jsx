import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'FANDOMS', href: '#fandoms' },
    { name: 'COLLECTIONS', href: '#collections' },
    { name: 'ABOUT', href: '#about' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b-4 border-black z-50 select-none">
      <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0 group">
          <motion.div 
            className="w-4 h-4 bg-black border border-white cursor-pointer"
            whileHover={{ rotate: 45 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          />
          <span className="font-inter font-black text-xl md:text-2xl tracking-tighter uppercase">
            ROCKERYXPRINTS
          </span>
        </a>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-space text-sm font-bold tracking-wider">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="relative py-1 group overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-75 group-hover:text-neutral-500">
                {link.name}
              </span>
              <span className="absolute left-0 bottom-0 w-full h-0.75 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-100 ease-in-out origin-left" />
            </a>
          ))}
        </nav>

        {/* CTA (Desktop) */}
        <div className="hidden md:block">
          <a 
            href="#collections" 
            className="inline-flex items-center gap-2 bg-black text-white font-space font-bold uppercase text-xs px-5 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 shadow-solid-sm translate-x-0.5 translate-y-0.5 hover:translate-x-0 hover:translate-y-0 hover:shadow-none"
          >
            Shop Now
            <ArrowRight size={14} />
          </a>
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-19 left-0 right-0 bg-white border-b-4 border-black md:hidden shadow-solid overflow-hidden"
          >
            <ul className="font-space font-bold uppercase text-sm divide-y-2 divide-black">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 hover:bg-black hover:text-white transition-colors duration-75"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="p-6 bg-neutral-100">
                <a 
                  href="#collections"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-black text-white px-5 py-4 border-2 border-black hover:bg-white hover:text-black font-bold text-center transition-colors duration-100"
                >
                  Shop Now
                  <ArrowRight size={16} />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
