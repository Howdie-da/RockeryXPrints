import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function Hero() {
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
    // Dynamic separation distance based on screen sizes
    let dist = 160;
    if (screenSize === 'mobile') dist = 70;
    if (screenSize === 'tablet') dist = 90;

    // 1. STACKED STATE (Default, container not hovered)
    if (!isStackHovered) {
      return {
        x: 0,
        y: 0,
        rotate: baseRotate,
        scale: 1,
        zIndex: id === 2 ? 12 : id === 3 ? 11 : 10,
      };
    }

    // 2. UNRAVELED STATE (Container is hovered)
    let xTarget = 0;
    if (id === 1) xTarget = -dist;
    if (id === 3) xTarget = dist;

    const isThisHovered = hoveredCard === id;
    const isAnyCardHovered = hoveredCard !== null;

    let scaleTarget = 0.78; // default unraveled scale (decreased)
    let yTarget = 0;
    let zIndexTarget = 20;

    if (isThisHovered) {
      scaleTarget = 1.0;  // hovered scale (decreased relative to original)
      yTarget = -35;      // lift it off the table!
      zIndexTarget = 30;  // pop to top
    } else if (isAnyCardHovered) {
      scaleTarget = 0.68; // shrink others even more
      yTarget = 15;       // push other cards down slightly
      zIndexTarget = id === 2 ? 22 : 15; // middle card overlaps non-hovered
    } else {
      // Stack is hovered but no specific card is hovered
      zIndexTarget = id === 2 ? 22 : 18; // middle card overlaps other cards
    }

    return {
      x: xTarget,
      y: yTarget,
      rotate: 0,
      scale: scaleTarget,
      zIndex: zIndexTarget,
    };
  };

  return (
    <section id="home" className="scroll-mt-[80px] grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] border-b-4 border-black bg-white select-none">
      
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
          <motion.a
            href="#collections"
            whileHover={{ x: 2, y: 2, boxShadow: '4px 4px 0px 0px #000000' }}
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px #000000' }}
            transition={springTransition}
            className="flex items-center gap-2 bg-black text-white font-space font-bold uppercase text-sm px-8 py-4 border-4 border-black shadow-solid"
          >
            Explore Inventory
            <ShoppingBag size={16} />
          </motion.a>
          
          <motion.a
            href="#about"
            whileHover={{ x: 2, y: 2, boxShadow: '4px 4px 0px 0px #000000' }}
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px #000000' }}
            transition={springTransition}
            className="flex items-center gap-2 bg-white text-black font-space font-bold uppercase text-sm px-8 py-4 border-4 border-black shadow-solid"
          >
            Our Process
            <ArrowRight size={16} />
          </motion.a>
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
          
          {/* Card 1: Bottom (Anime / Shinigami) */}
          <motion.div
            animate={getCardProps(1, -10)}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            transition={springTransition}
            className="absolute w-full h-full bg-white border-8 border-black shadow-solid p-6 flex flex-col justify-between cursor-pointer"
          >
            {/* Matte border & print placeholder */}
            <div className="w-full h-[85%] border-2 border-black bg-stripes relative flex items-center justify-center">
              {/* Shinigami Symbol SVG */}
              <svg className="w-20 h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.026C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
                <path d="M8 14s1.5-2 4-2 4 2 4 2" stroke="black" strokeWidth="2" fill="none" />
                <circle cx="9" cy="9" r="1" fill="black" />
                <circle cx="15" cy="9" r="1" fill="black" />
              </svg>
              <div className="absolute top-2 left-2 bg-black text-white font-space text-[10px] px-1 font-bold">
                A // 01
              </div>
            </div>
            {/* Title card */}
            <div className="flex justify-between items-center font-space text-xs font-bold mt-2">
              <span>SHINIGAMI // 01</span>
              <span>$45.00</span>
            </div>
          </motion.div>

          {/* Card 2: Middle (Cyberpunk Eye) */}
          <motion.div
            animate={getCardProps(2, 0)}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            transition={springTransition}
            className="absolute w-full h-full bg-white border-8 border-black shadow-solid p-6 flex flex-col justify-between cursor-pointer"
          >
            {/* Matte border & print placeholder */}
            <div className="w-full h-[85%] border-2 border-black bg-stripes relative flex items-center justify-center">
              {/* Cyberpunk Eye SVG */}
              <svg className="w-24 h-24 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="black" stroke="black" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="white" stroke="black" strokeWidth="2" />
                <circle cx="12" cy="12" r="1" fill="black" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" />
              </svg>
              <div className="absolute top-2 left-2 bg-black text-white font-space text-[10px] px-1 font-bold">
                C // 07
              </div>
            </div>
            {/* Title card */}
            <div className="flex justify-between items-center font-space text-xs font-bold mt-2">
              <span>NEO-TOKYO // 07</span>
              <span>$45.00</span>
            </div>
          </motion.div>

          {/* Card 3: Top (Gaming / Runesmith) */}
          <motion.div
            animate={getCardProps(3, 10)}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            transition={springTransition}
            className="absolute w-full h-full bg-white border-8 border-black shadow-solid p-6 flex flex-col justify-between cursor-pointer"
          >
            {/* Matte border & print placeholder */}
            <div className="w-full h-[85%] border-2 border-black bg-stripes relative flex items-center justify-center">
              {/* Elden Rune Geometric SVG */}
              <svg className="w-20 h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8" stroke="black" strokeWidth="3" />
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
                <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="black" strokeWidth="1.5" />
              </svg>
              <div className="absolute top-2 left-2 bg-black text-white font-space text-[10px] px-1 font-bold">
                G // 12
              </div>
            </div>
            {/* Title card */}
            <div className="flex justify-between items-center font-space text-xs font-bold mt-2">
              <span>RUNESMITH // 12</span>
              <span>$45.00</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
