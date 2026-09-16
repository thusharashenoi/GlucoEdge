import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35 + i * 0.12,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Hero() {
  return (
    <section id="top" className="relative h-dvh min-h-[720px] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/stills/ring.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
      <div className="absolute inset-0 scanline opacity-30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 pt-28 md:px-8 md:pb-24">
        <motion.p
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mb-5 font-mono text-[11px] tracking-[0.42em] text-led uppercase"
        >
          Non-invasive · Optical · Thermal
        </motion.p>
        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="max-w-3xl text-5xl leading-[0.95] font-light tracking-tight md:text-7xl lg:text-8xl"
        >
          Blood glucose.
          <br />
          <span className="text-led glow-led">No lancet.</span>
        </motion.h1>
        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-7 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          GlucoEdge is a finger-worn sensor that estimates blood sugar from
          infrared photoplethysmography and skin temperature — then checks every
          prediction against a clinical fingerstick glucometer.
        </motion.p>
        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-8"
        >
          <a
            href="#architecture"
            className="rounded-full bg-led px-6 py-3 text-[12px] font-semibold tracking-[0.22em] text-ink uppercase"
          >
            See the system
          </a>
          <div className="flex gap-10 font-mono text-[11px] tracking-[0.18em] text-mist uppercase">
            <div>
              <div className="text-white">IR 880 nm</div>
              <div className="mt-1 text-led/80">Optical path</div>
            </div>
            <div>
              <div className="text-white">DS18B20</div>
              <div className="mt-1 text-led/80">Thermal path</div>
            </div>
            <div>
              <div className="text-white">vs glucometer</div>
              <div className="mt-1 text-led/80">Ground truth</div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#architecture"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-mist uppercase"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}
