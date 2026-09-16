import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nodes = [
  {
    id: "chassis",
    x: "16%",
    y: "58%",
    tag: "01",
    title: "Optical chassis",
    copy: "Matte titanium ring body. An inner optical window seats against the finger so IR and red light couple into capillary tissue without a lancet.",
  },
  {
    id: "array",
    x: "36%",
    y: "42%",
    tag: "02",
    title: "Sensor array",
    copy: "MAX30102 PPG front-end. Dual LEDs (IR 880 nm + Red 660 nm) and a photodiode read the pulsatile blood volume signal used as the glucose optical proxy.",
  },
  {
    id: "mcu",
    x: "50%",
    y: "36%",
    tag: "03",
    title: "Signal processor",
    copy: "On-ring MCU timestamps IR, Red, and temperature, runs contact detection, and packages a 10-second feature window for the estimator.",
  },
  {
    id: "thermal",
    x: "62%",
    y: "48%",
    tag: "04",
    title: "Thermal stack",
    copy: "A copper thermal mass plus DS18B20 skin probe. Temperature corrects LED output and optical path so heat is not mistaken for glucose.",
  },
  {
    id: "cell",
    x: "72%",
    y: "58%",
    tag: "05",
    title: "Power cell",
    copy: "Compact cell sized for continuous low-duty optical sampling. The POC currently runs tethered; the ring form is the product target.",
  },
  {
    id: "housing",
    x: "86%",
    y: "50%",
    tag: "06",
    title: "Inner housing",
    copy: "Protective inner shell keeps the optical axis stable against the finger while shielding the board from strain and sweat.",
  },
];

const flow = [
  { k: "FINGER", d: "Capillary bed" },
  { k: "IR + RED", d: "MAX30102 PPG" },
  { k: "TEMP", d: "DS18B20" },
  { k: "MCU", d: "ESP32-S3" },
  { k: "MODEL", d: "mg/dL" },
  { k: "TRUTH", d: "Glucometer" },
];

export default function Architecture() {
  const [active, setActive] = useState(nodes[1].id);
  const current = nodes.find((n) => n.id === active) ?? nodes[1];

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
            Every layer of the ring, drawn like a blueprint.
          </h2>
          <p className="mt-5 max-w-2xl text-mist">
            Product vision is a sealed sensing ring. The optical and thermal
            chain is the same one running on the current ESP32-S3 proof of
            concept.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-border relative aspect-[16/9] overflow-hidden rounded-2xl"
          >
            <img
              src="/stills/exploded.jpg"
              alt="GlucoEdge exploded architecture"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 56" preserveAspectRatio="none">
              <motion.line
                x1="11"
                y1="28"
                x2="88"
                y2="28"
                stroke="rgba(61,255,138,0.28)"
                strokeWidth="0.12"
                strokeDasharray="1 0.8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </svg>
            {nodes.map((node, i) => (
              <button
                key={node.id}
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

          <AnimatePresence mode="wait">
            <motion.aside
              key={current.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35 }}
              className="hud-border flex flex-col justify-between rounded-2xl p-6 md:p-8"
            >
              <div>
                <p className="font-mono text-[11px] tracking-[0.3em] text-led">
                  MODULE {current.tag}
                </p>
                <h3 className="mt-3 text-3xl font-light">{current.title}</h3>
                <p className="mt-4 leading-relaxed text-mist">{current.copy}</p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setActive(node.id)}
                    className={`rounded-lg border px-2 py-2 text-left font-mono text-[10px] tracking-wider uppercase ${
                      active === node.id
                        ? "border-led/50 bg-led/10 text-led"
                        : "border-white/10 text-mist hover:border-white/25"
                    }`}
                  >
                    {node.tag} {node.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </motion.aside>
          </AnimatePresence>
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
        </div>
      </div>
    </section>
  );
}
