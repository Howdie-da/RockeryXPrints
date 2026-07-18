// src/components/landing/FeaturedProducts.jsx
import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Heart, Plus } from 'lucide-react';
import { addToCart } from '../../store/cartSlice';
import { getProductSvg, mockProducts } from '../../data/mockData';

export default function FeaturedProducts({ products }) {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [added, setAdded] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = (product, e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
    setAdded((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product._id]: false })), 1500);
  };

  // Safe fallback to first four mock products
  const displayProducts = Array.isArray(products) && products.length === 4
    ? products
    : mockProducts.slice(0, 4);

  return (
    <section id="collections" className="scroll-mt-20 bg-white border-b-4 border-black select-none">

      {/* Header */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
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
        <Link
        to='/shop'
        >
          <motion.div 
            whileHover="hover"
            className="font-space text-sm font-bold uppercase border-2 border-black px-4 py-2 bg-neutral-100 flex items-center gap-2 cursor-pointer"
          >
            <motion.div
              className="w-3 h-3 bg-black border border-white"
              variants={{
                hover: { rotate: 45 }
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            />
            <span>More</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-black gap-1 p-1">
        {displayProducts.map((product, index) => {
          const isWishlisted = wishlist.includes(product._id);
          const isAdded = added[product._id];
          const isSoldOut = product.stock === 0;

          return (
            <motion.div
              key={product._id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: index * 0.1 }}
              whileHover={{ x: -6, y: -6, boxShadow: '8px 8px 0px 0px #000000' }}
              className="bg-black relative border-2 border-black overflow-hidden"
            >
              <div className="bg-white p-6 h-full flex flex-col justify-between relative z-10">
                <div>
                  {/* Image area — click goes to detail page */}
                  <Link to={`/products/${product.slug}`} className="block">
                    <div className="w-full aspect-3/4 bg-stripes border-2 border-black relative flex items-center justify-center mb-6 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        getProductSvg(product.slug, index)
                      )}
                    </div>
                  </Link>

                  {/* Metadata */}
                  <Link to={`/products/${product.slug}`} className="block font-space">
                    <span className="text-[11px] font-bold text-neutral-500 tracking-widest uppercase block mb-1">
                      {product.categoryDetails?.name || 'CATEGORY'}
                    </span>
                    <h3 className="font-space font-extrabold text-lg md:text-xl uppercase tracking-tight text-black mb-2 hover:text-neutral-500 transition-colors duration-75">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Price + Add */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-neutral-300">
                  <span className="font-space font-black text-lg text-black">
                    ₹{product.sellingPrice?.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={(e) => !isSoldOut && handleAdd(product, e)}
                    disabled={isSoldOut}
                    className={`flex items-center gap-1.5 font-space font-bold uppercase text-xs px-4 py-2.5 border-2 border-black transition-colors duration-100 cursor-pointer ${
                      isSoldOut
                        ? 'opacity-40 cursor-not-allowed bg-neutral-100'
                        : isAdded
                          ? 'bg-black text-white'
                          : 'bg-black text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <Plus size={14} />
                    <span>{isSoldOut ? 'OUT' : isAdded ? '✓' : 'ADD'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
