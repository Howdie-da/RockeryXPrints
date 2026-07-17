import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, ShoppingCart } from 'lucide-react';

export default function FeaturedProducts() {
  const [wishlist, setWishlist] = useState([]);
  
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const products = [
    {
      id: 1,
      name: 'SHINIGAMI // 01',
      fandom: 'ANIME FANDOM',
      price: '$45.00',
      badge: 'LIMITED RUN // 100',
      svg: (
        <svg className="w-16 h-16 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
          <path d="M8 14s1.5-2 4-2 4 2 4 2" stroke="black" strokeWidth="2" />
          <circle cx="9" cy="9" r="1.5" fill="black" />
          <circle cx="15" cy="9" r="1.5" fill="black" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="black" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'NEO-TOKYO // 07',
      fandom: 'CYBERPUNK FANDOM',
      price: '$45.00',
      badge: 'NEW DROP',
      svg: (
        <svg className="w-16 h-16 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="black" stroke="black" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.5" fill="white" stroke="black" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'RUNESMITH // 12',
      fandom: 'GAMING FANDOM',
      price: '$45.00',
      badge: 'RESTOCK',
      svg: (
        <svg className="w-16 h-16 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" stroke="black" strokeWidth="3" fill="none" />
          <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none" />
          <path d="M12 2v20M2 12h20" stroke="black" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'DARK KNIGHT // 03',
      fandom: 'COMICS FANDOM',
      price: '$50.00',
      badge: 'ONLY 5 LEFT',
      svg: (
        <svg className="w-16 h-16 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 10c2 2 4 4 10 0 6 4 8 2 10 0 0-4-3-6-10-6S2 6 2 10Z" fill="black" stroke="black" strokeWidth="2" />
          <path d="M12 4v16" stroke="black" strokeWidth="2" />
          <path d="M8 8s2-1 4-1 4 1 4 1" stroke="black" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  return (
    <section id="collections" className="scroll-mt-20 bg-white border-b-4 border-black select-none">
      
      {/* H2 Title Header */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        className="border-b-4 border-black px-6 py-8 md:px-12 bg-white flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <span className="font-space text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-neutral-500 mb-2 block">
            COLLECTIBLE FRAME INVENTORY
          </span>
          <h2 className="font-inter font-black text-4xl md:text-6xl tracking-tighter uppercase leading-none">
            INVENTORY
          </h2>
        </div>
        <div className="font-space text-sm font-bold uppercase border-2 border-black px-4 py-2 bg-neutral-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-black"></span>
          <span>4 ORIGINALS AVAILABLE</span>
        </div>
      </motion.div>

      {/* Grid: collapsed borders style */}
      {/* Parent has top and left border, each card has right and bottom border */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-0 border-l-0 bg-black gap-1 p-1">
        {products.map((product, index) => {
          const isWishlisted = wishlist.includes(product.id);
          return (
            <motion.div 
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: index * 0.1 }}
              className="bg-white relative p-6 flex flex-col justify-between border-2 border-black"
            >
              {/* Card Container with snappy float on hover */}
              <motion.div
                whileHover={{ 
                  x: -6, 
                  y: -6, 
                  boxShadow: '8px 8px 0px 0px #000000'
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.15 }}
                className="bg-white h-full flex flex-col justify-between relative z-10"
              >
                <div>
                  {/* Image/Stripe Placeholder */}
                  <div className="w-full aspect-3/4 bg-stripes border-2 border-black relative flex items-center justify-center mb-6 overflow-hidden">
                    {product.svg}
                    
                    {/* Top-Left Badge */}
                    <div className="absolute top-0 left-0 bg-black text-white font-space text-[10px] md:text-xs font-bold px-3 py-1.5 border-r-2 border-b-2 border-black uppercase tracking-wider">
                      {product.badge}
                    </div>

                    {/* Top-Right Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-0 right-0 w-10 h-10 border-l-2 border-b-2 border-black flex items-center justify-center transition-colors duration-75 cursor-pointer ${
                        isWishlisted ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                      aria-label="Add to Wishlist"
                    >
                      <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="font-space">
                    <span className="text-[11px] font-bold text-neutral-500 tracking-widest uppercase block mb-1">
                      {product.fandom}
                    </span>
                    <h3 className="font-space font-extrabold text-lg md:text-xl uppercase tracking-tight text-black mb-2">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-neutral-300">
                  <span className="font-space font-black text-lg text-black">
                    {product.price}
                  </span>
                  
                  <button 
                    className="flex items-center gap-1.5 bg-black text-white font-space font-bold uppercase text-xs px-4 py-2.5 border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>ADD</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
