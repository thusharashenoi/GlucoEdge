import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Product() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8">
        <motion.figure
          style={{ y }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud-border relative overflow-hidden rounded-2xl"
        >
          <img
            src="/stills/ring.jpg"
            alt="GlucoEdge ring on finger"
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-6">
            <p className="font-mono text-[11px] tracking-[0.3em] text-led uppercase">
              Product form
            </p>
            <p className="mt-2 text-2xl font-light">A ring. A sensor. A number.</p>
          </figcaption>
        </motion.figure>
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="hud-border relative overflow-hidden rounded-2xl"
        >
          <img
            src="/stills/hud.jpg"
            alt="GlucoEdge live glucose HUD"
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
          <div className="absolute top-5 right-5 hud-border rounded-xl px-4 py-3">
            <div className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
              Live estimate
            </div>
            <div className="text-3xl font-light text-led glow-led">105 mg/dL</div>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
