import { motion } from 'framer-motion';

export default function FandomMarquee() {
  const fandoms = [
    'ANIME',
    'GAMING',
    'MANGA',
    'COMICS',
    'SCI-FI',
    'POP CULTURE',
    'DARK FANTASY',
    'CYBERPUNK',
    'RETRO',
  ];

  // Duplicate to make scrolling infinite and seamless
  const duplicatedFandoms = [...fandoms, ...fandoms, ...fandoms, ...fandoms];

  return (
    <section id="fandoms" className="scroll-mt-[80px] bg-black border-b-4 border-black overflow-hidden py-1 select-none">
      <div className="flex w-max">
        <motion.div
          animate={{ x: [0, "-25%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
          className="flex whitespace-nowrap"
        >
          {duplicatedFandoms.map((fandom, idx) => (
            <div
              key={idx}
              className="inline-block font-space font-bold uppercase text-base md:text-lg tracking-widest text-white py-4 px-10 border-r border-white hover:bg-white hover:text-black transition-colors duration-0 cursor-pointer first:border-l"
            >
              {fandom}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
