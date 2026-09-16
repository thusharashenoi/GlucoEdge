import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HudVisual, RingVisual } from "./ProductFrames";

export default function Product() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} id="product" className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8">
        <motion.figure
          style={{ y }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud-border relative overflow-hidden rounded-2xl"
        >
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="rounded-full border border-white/10 bg-ink/70 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-led uppercase backdrop-blur">
              PPG well
            </span>
            <span className="rounded-full border border-white/10 bg-ink/70 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-gold uppercase backdrop-blur">
              EIS pads
            </span>
          </div>
          <RingVisual />
          <figcaption className="border-t border-white/8 bg-panel px-6 py-5">
            <p className="font-mono text-[11px] tracking-[0.3em] text-led uppercase">
              Product form · 4× jewelry profile
            </p>
            <p className="mt-2 text-2xl font-light">A light-sealed sensing chassis.</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
              Thick enough for optical PPG and electrical impedance, with an
              inner well that blocks ambient light.
            </p>
          </figcaption>
        </motion.figure>
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="hud-border relative overflow-hidden rounded-2xl"
        >
          <HudVisual band="In range" mgdl={105} />
          <figcaption className="border-t border-white/8 bg-panel px-6 py-5">
            <p className="font-mono text-[11px] tracking-[0.3em] text-led uppercase">
              Wearer HUD
            </p>
            <p className="mt-2 text-2xl font-light">Band first. Number as context.</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
              The ring reports Low, In range, Elevated, or High — with mg/dL
              on the display, not a lab printout.
            </p>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
