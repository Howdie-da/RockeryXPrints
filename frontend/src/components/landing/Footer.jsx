import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const links = [
    { name: 'Shop Inventory', href: '#collections' },
    { name: 'Fandom Marquee', href: '#fandoms' },
    { name: 'Our Process', href: '#about' },
    { name: 'Custom Commissions', href: '#' },
    { name: 'Return Policy', href: '#' },
  ];

  return (
    <footer id="contact" className="scroll-mt-[80px] bg-black text-white border-t-4 border-black select-none">
      
      {/* Massive Edge-to-Edge Typography Banner */}
      <div className="w-full border-b-4 border-white overflow-hidden py-6">
        <motion.h2 
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
          className="font-inter font-black uppercase text-[10vw] md:text-[11vw] leading-none text-center tracking-tighter select-none whitespace-nowrap"
        >
          ROCKERYXPRINTS
        </motion.h2>
      </div>

      {/* Footer Content Grid */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16"
      >
        
        {/* Column 1: Info & Socials */}
        <div className="flex flex-col justify-between border-b-2 lg:border-b-0 border-neutral-800 pb-8 lg:pb-0">
          <div>
            <h3 className="font-space font-bold uppercase text-lg mb-4 tracking-wider">
              // THE MANIFESTO
            </h3>
            <p className="font-space text-xs md:text-sm text-neutral-400 leading-relaxed max-w-sm mb-8">
              We reject gradients, drop shadows, and soft edges. 
              We believe in high-contrast spaces, industrial lines, and raw fandom print collections. 
              Each print is built to dominate the room it occupies.
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-100" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-100" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-100" aria-label="GitHub">
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="border-b-2 lg:border-b-0 border-neutral-800 pb-8 lg:pb-0">
          <h3 className="font-space font-bold uppercase text-lg mb-4 tracking-wider">
            // INDEX
          </h3>
          <ul className="font-space text-xs md:text-sm font-bold uppercase space-y-4">
            {links.map((link, idx) => (
              <li key={idx}>
                <a 
                  href={link.href}
                  className="inline-flex items-center gap-1 hover:text-neutral-400 transition-colors"
                >
                  <span className="text-xs mr-2 font-normal text-neutral-600">[{idx+1}]</span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Newsletter Form */}
        <div>
          <h3 className="font-space font-bold uppercase text-lg mb-4 tracking-wider">
            // DISPATCH
          </h3>
          <p className="font-space text-xs md:text-sm text-neutral-400 leading-relaxed mb-6">
            Subscribe to receive notices of new fandom drops, custom runs, and inventory restocks. Zero spam.
          </p>

          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex flex-col gap-3"
          >
            <input 
              type="email" 
              required
              placeholder="ENTER EMAIL ADDRESS" 
              className="bg-black text-white border-2 border-white p-3 font-space text-xs rounded-none w-full placeholder:text-neutral-500 focus:bg-white focus:text-black focus:placeholder:text-neutral-300 focus:outline-none transition-colors duration-100 uppercase"
            />
            
            <button 
              type="submit"
              className="bg-white text-black border-2 border-white p-3 font-space font-bold text-xs hover:bg-black hover:text-white transition-colors duration-100 uppercase w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

      </motion.div>

      {/* Copyright Bar */}
      <div className="border-t border-neutral-800 py-6 text-center font-space text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} ROCKERYXPRINTS. ALL BORDERS RESPECTED.
      </div>
    </footer>
  );
}
