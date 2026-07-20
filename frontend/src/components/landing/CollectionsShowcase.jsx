// src/components/landing/CollectionsShowcase.jsx
// Visual Manual Collections Showcase component with infinite scrolling marquee effect
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import { getCollections } from '../../services/api';
import { mockCollections, getProductSvg } from '../../data/mockData';

export default function CollectionsShowcase() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState(mockCollections);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getCollections()
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          setCollections(data);
        } else {
          setCollections(mockCollections);
        }
      })
      .catch(() => {
        setCollections(mockCollections);
      })
      .finally(() => setLoading(false));
  }, []);

  // Multiply items to ensure seamless infinite loop
  const marqueeItems = [...collections, ...collections, ...collections, ...collections];

  return (
    <section id="collections-showcase" className="scroll-mt-20 bg-black text-white border-b-4 border-black select-none overflow-hidden py-10">

      {/* Infinite Marquee Track */}
      {loading ? (
        <div className="flex gap-6 px-6 overflow-hidden max-w-7xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-2 border-neutral-800 bg-neutral-900 p-5 h-72 w-80 shrink-0 animate-pulse flex flex-col justify-between">
              <div className="w-full h-40 bg-neutral-800" />
              <div className="h-5 bg-neutral-800 w-2/3 mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden py-2 group">
          {/* Ambient Edge Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

          <style>{`
            @keyframes marqueeTrack {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .animate-marquee-smooth {
              animation: marqueeTrack ${Math.max(25, collections.length * 6)}s linear infinite;
              will-change: transform;
            }
            .animate-marquee-smooth:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex gap-6 w-max px-3 animate-marquee-smooth">
            {marqueeItems.map((col, idx) => {
              const tagParam = col.searchTag || col.slug || col.name;
              return (
                <div
                  key={`${col._id || idx}-${idx}`}
                  onClick={() => navigate(`/shop?tag=${encodeURIComponent(tagParam)}`)}
                  className="group/card w-72 sm:w-80 border-2 border-neutral-800 hover:border-white bg-neutral-950 flex flex-col justify-between p-4 cursor-pointer transition-colors duration-150 shrink-0 relative overflow-hidden shadow-solid-sm"
                >
                  {/* Image Matte */}
                  <div className="w-full h-44 border border-neutral-800 bg-neutral-900 relative overflow-hidden mb-3 flex items-center justify-center">
                    {col.coverImage ? (
                      <img
                        src={col.coverImage}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 bg-stripes-dark">
                        {getProductSvg(col.slug || 'anime', idx)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex justify-center items-start gap-2 mb-1">
                      <h3 className="font-inter font-black text-lg uppercase tracking-tight text-white group-hover/card:text-neutral-300 transition-colors truncate">
                        {col.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
