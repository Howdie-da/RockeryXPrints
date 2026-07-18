// src/components/landing/Hero.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { getProductSvg, mockProducts } from '../../data/mockData';

export default function Hero({ products }) {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'
  const [isStackHovered, setIsStackHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const springTransition = { type: 'spring', bounce: 0, duration: 0.4 };

  const getCardProps = (id, baseRotate) => {
    let dist = 160;
    if (screenSize === 'mobile') dist = 70;
    if (screenSize === 'tablet') dist = 90;

    if (!isStackHovered) {
      return {
        x: 0,
        y: 0,
        rotate: baseRotate,
        scale: 1,
        zIndex: id === 2 ? 12 : id === 3 ? 11 : 10,
      };
    }

    let xTarget = 0;
    if (id === 1) xTarget = -dist;
    if (id === 3) xTarget = dist;

    const isThisHovered = hoveredCard === id;
    const isAnyCardHovered = hoveredCard !== null;

    let scaleTarget = 0.78;
    let yTarget = 0;
    let zIndexTarget = 20;

    if (isThisHovered) {
      scaleTarget = 1.0;
      yTarget = -35;
      zIndexTarget = 30;
    } else if (isAnyCardHovered) {
      scaleTarget = 0.68;
      yTarget = 15;
      zIndexTarget = id === 2 ? 22 : 15;
    } else {
      zIndexTarget = id === 2 ? 22 : 18;
    }

    return {
      x: xTarget,
      y: yTarget,
      rotate: 0,
      scale: scaleTarget,
      zIndex: zIndexTarget,
    };
  };

  // Safe fallback to first three mock products if none passed
  const displayProducts = Array.isArray(products) && products.length === 3
    ? products
    : mockProducts.slice(0, 3);

  return (
    <section id="home" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] border-b-4 border-black bg-white select-none">
      
      {/* Left Column: Copy & Actions */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-16 lg:px-20 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
        <span className="font-space text-xs md:text-sm font-bold uppercase tracking-[0.25em] bg-black text-white px-3 py-1.5 self-start mb-6 border border-black shadow-solid-sm">
          EST. 2026 // LIMITED RUNS
        </span>
        
        <h1 className="font-inter font-black text-5xl md:text-7xl xl:text-8xl leading-[0.9] tracking-tighter uppercase mb-6">
          YOUR FANDOM.<br />
          <span className="bg-black text-white px-3 py-1 inline-block mt-2">IN A BOX.</span>
        </h1>
        
        <p className="font-space text-sm md:text-base text-neutral-600 leading-relaxed max-w-lg mb-10">
          Heavyweight archival paper. Pure monochrome pigments. Encased in raw 20mm industrial frames. 
          Limited to exactly 100 prints per fandom, hand-numbered. No colors. No clutter. Just raw obsession.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-5">
          <motion.div
            whileHover={{ x: 2, y: 2, boxShadow: '4px 4px 0px 0px #000000' }}
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px #000000' }}
            transition={springTransition}
          >
            <Link
              to="/shop"
              className="flex items-center gap-2 bg-black text-white font-space font-bold uppercase text-sm px-8 py-4 border-4 border-black shadow-solid touch-manipulation"
            >
              Explore Inventory
              <ShoppingBag size={16} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Rotating Frame Stack Showcase */}
      <div className="relative flex items-center justify-center bg-[#F5F5F5] bg-stripes-light px-8 py-16 overflow-hidden min-h-125 lg:min-h-0">
        
        {/* Frame Stack Container */}
        <div 
          className="relative w-70 h-92.5 sm:w-[320px] sm:h-105 flex items-center justify-center"
          onMouseEnter={() => setIsStackHovered(true)}
          onMouseLeave={() => {
            setIsStackHovered(false);
            setHoveredCard(null);
          }}
        >
          
          {displayProducts.map((prod, index) => {
            const cardId = index + 1; // 1, 2, 3
            // Base rotation for stacked state: card 1 = -10 deg, card 2 = 0 deg, card 3 = 10 deg
            const baseRotate = index === 0 ? -10 : index === 1 ? 0 : 10;
            
            return (
              <motion.div
                key={prod._id}
                animate={getCardProps(cardId, baseRotate)}
                onMouseEnter={() => setHoveredCard(cardId)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/products/${prod.slug}`)}
                transition={springTransition}
                className="absolute w-full h-full bg-white border-8 border-black shadow-solid p-6 flex flex-col justify-between cursor-pointer select-none"
              >
                {/* Matte border & print placeholder */}
                <div className="w-full h-[85%] border-2 border-black bg-stripes relative flex items-center justify-center overflow-hidden">
                  {prod.images && prod.images[0] ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    getProductSvg(prod.slug, index)
                  )}
                </div>
                {/* Title card */}
                <div className="flex justify-between items-center font-space text-xs font-bold mt-2">
                  <span className="truncate mr-2 uppercase">{prod.name}</span>
                  <span>₹{prod.sellingPrice?.toLocaleString('en-IN')}</span>
                </div>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
