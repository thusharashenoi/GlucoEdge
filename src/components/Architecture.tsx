import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nodes = [
  {
    id: "chassis",
    x: "16%",
    y: "54%",
    tag: "01",
    title: "Optical chassis",
    image: "/stills/arch/chassis.png",
    copy: "A long matte titanium sleeve — not a jewelry band — so optics, electrodes, and a light-tight well fit against the finger without a lancet.",
  },
  {
    id: "array",
    x: "36%",
    y: "46%",
    tag: "02",
    title: "Sensor array",
    image: "/stills/arch/array.png",
    copy: "Inner PPG and dual NIR sit in a dark optical well. Gold skin-contact pads measure electrical impedance through the same tissue bed. Ambient light never reaches the photodiode.",
  },
  {
    id: "mcu",
    x: "52%",
    y: "40%",
    tag: "03",
    title: "Signal processor",
    image: "/stills/arch/mcu.png",
    copy: "A curved flex PCB timestamps optics, impedance, and temperature, runs contact detection, and packages a short feature window for LightGBM.",
  },
  {
    id: "thermal",
    x: "68%",
    y: "48%",
    tag: "04",
    title: "Thermal stack",
    image: "/stills/arch/thermal.png",
    copy: "A copper thermal mass plus a skin-temperature probe. Heat corrects LED output and optical path so temperature is never mistaken for glucose.",
  },
  {
    id: "cell",
    x: "82%",
    y: "50%",
    tag: "05",
    title: "Power cell",
    image: "/stills/arch/cell.png",
    copy: "A thin curved cell sized for continuous low-duty optical sampling. Today the sensing chain runs on a tethered bench; the ring is the product target.",
  },
  {
    id: "housing",
    x: "93%",
    y: "56%",
    tag: "06",
    title: "Inner housing",
    image: "/stills/arch/housing.png",
    copy: "A matte inner gasket seats the ring, seals the optical well from room light, and holds impedance electrodes flush to skin.",
  },
];

const flow = [
  { k: "FINGER", d: "Capillary bed" },
  { k: "PPG + NIR", d: "Optical well" },
  { k: "EIS", d: "Impedance" },
  { k: "TEMP", d: "Skin thermal" },
  { k: "MODEL", d: "Fusion" },
  { k: "BAND", d: "Glucose band" },
];

export default function Architecture() {
  const [active, setActive] = useState(nodes[0].id);
  const current = nodes.find((n) => n.id === active) ?? nodes[0];

  return (
    <section id="architecture" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-[11px] tracking-[0.4em] text-led uppercase">
            02 — Architecture
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            Every layer of the ring, as it would be built.
          </h2>
          <p className="mt-5 max-w-2xl text-mist">
            Tap a module on the exploded sleeve. Each still is the physical
            part — chassis, optics, flex, thermal, cell, gasket — not a
            schematic block.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-border relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink"
          >
            <img
              src="/stills/arch/exploded.png"
              alt="GlucoEdge exploded sleeve architecture"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/25" />
            {nodes.map((node, i) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setActive(node.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: node.x, top: node.y }}
              >
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={`relative grid h-8 w-8 place-items-center rounded-full border-2 shadow-[0_0_16px_rgba(61,255,138,0.45)] ${
                    active === node.id
                      ? "border-led bg-led text-ink"
                      : "border-led bg-ink text-led"
                  }`}
                >
                  {active === node.id && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-led"
                      animate={{ scale: [1, 1.85], opacity: [0.7, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                  <span className="font-mono text-[10px] font-semibold">{node.tag}</span>
                </motion.span>
              </button>
            ))}
            <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
              EXPLODED · DWG-GE-01
            </div>
          </motion.div>

          <div className="min-h-0 lg:h-full">
            <AnimatePresence mode="wait">
              <motion.aside
                key={current.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className="hud-border flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl lg:min-h-0"
              >
                <div className="relative min-h-[200px] flex-1 overflow-hidden">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                </div>
                <div className="shrink-0 p-6 md:p-7">
                  <p className="font-mono text-[11px] tracking-[0.3em] text-led">
                    MODULE {current.tag}
                  </p>
                  <h3 className="mt-2 text-3xl font-light">{current.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
                    {current.copy}
                  </p>
                </div>
              </motion.aside>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-16">
          <p className="mb-6 font-mono text-[11px] tracking-[0.3em] text-mist uppercase">
            Sensing chain
          </p>
          <div className="grid gap-3 md:grid-cols-6">
            {flow.map((item, i) => (
              <motion.div
                key={item.k}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="hud-border relative rounded-xl px-4 py-4"
              >
                <div className="font-mono text-[11px] tracking-[0.22em] text-led">
                  {item.k}
                </div>
                <div className="mt-1 text-sm text-white/80">{item.d}</div>
                {i < flow.length - 1 && (
                  <span className="absolute top-1/2 -right-2 hidden text-led md:block">
                    →
                  </span>
                )}
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-sm text-mist">
            Optical and thermal paths already run on the bench. Impedance is
            product-only.{" "}
            <a href="#poc" className="text-led hover:underline">
              See the NIO-GM prototype ↓
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
