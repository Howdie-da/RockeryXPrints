import { motion } from 'framer-motion';

export default function BentoAbout() {
  const points = [
    {
      num: '[ 01 ]',
      title: 'STRICT MONOCHROME',
      desc: 'Absolute black and white framed art. Zero color bleeding. Optimized for high-contrast minimalist and brutalist spaces.',
    },
    {
      num: '[ 02 ]',
      title: 'ULTRA-HEAVY GLASS',
      desc: 'Encased in thick, heavy 3mm gallery-grade glass. Solid wood structures with zero plastic or faux composite materials.',
    },
    {
      num: '[ 03 ]',
      title: 'NUMBERED EDITIONS',
      desc: 'Limited runs of exactly 100 prints per design. Each frame features a custom metal engraved plate with its serial number.',
    },
  ];

  return (
    <section id="about" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-3 border-b-4 border-black bg-white select-none">
      {points.map((point, index) => (
        <motion.div
          key={index}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: index * 0.15 }}
          className={`flex flex-col justify-between p-8 md:p-12 lg:p-16 transition-colors duration-100 ease-in-out hover:bg-black hover:text-white group bg-white text-black ${
            index < points.length - 1
              ? 'border-b-4 lg:border-b-0 lg:border-r-4 border-black'
              : ''
          }`}
        >
          {/* ASCII Column Index */}
          <div className="font-space font-bold text-4xl md:text-5xl tracking-widest mb-12 text-black group-hover:text-white">
            {point.num}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-inter font-black text-2xl md:text-3xl uppercase tracking-tighter mb-4">
              {point.title}
            </h3>
            <p className="font-space text-xs md:text-sm leading-relaxed text-neutral-600 group-hover:text-neutral-300">
              {point.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
