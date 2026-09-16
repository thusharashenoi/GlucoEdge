import { motion } from "framer-motion";
import { modelChoice, productPipeline } from "../data/poc";

export default function Algorithm() {
  return (
    <section id="model" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-[11px] tracking-[0.4em] text-led uppercase">
            03 — Algorithm
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            LightGBM in. A glucose band out.
          </h2>
          <p className="mt-5 max-w-2xl text-mist">
            Features come from a light-sealed optical well, skin impedance, and
            temperature. The estimator is not a neural net on raw PPG — it is a
            gradient-boosted tree model sized for a small paired dataset and an
            on-ring MCU.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="hud-border rounded-2xl p-6 md:col-span-1">
            <p className="font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
              Estimator
            </p>
            <p className="mt-3 text-4xl font-light text-led glow-led">{modelChoice.name}</p>
            <p className="mt-2 text-sm text-white/80">{modelChoice.family}</p>
            <div className="mt-6 space-y-3 font-mono text-[12px]">
              <div>
                <div className="text-mist">Primary head</div>
                <div className="mt-1 text-led">{modelChoice.primary}</div>
              </div>
              <div>
                <div className="text-mist">Secondary head</div>
                <div className="mt-1 text-gold">{modelChoice.secondary}</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
            {modelChoice.why.map((item, i) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="hud-border rounded-2xl p-5"
              >
                <div className="font-mono text-[11px] tracking-[0.2em] text-led uppercase">
                  {item.t}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-mist">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {productPipeline.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="hud-border rounded-2xl p-4"
            >
              <div className="font-mono text-[11px] text-led">{item.step}</div>
              <div className="mt-2 text-sm font-medium">{item.title}</div>
              <p className="mt-2 text-xs leading-relaxed text-mist">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { k: "Low", d: "<70 mg/dL" },
            { k: "In range", d: "70–99 mg/dL" },
            { k: "Elevated", d: "100–125 mg/dL" },
            { k: "High", d: "≥126 mg/dL" },
          ].map((b) => (
            <div key={b.k} className="hud-border rounded-2xl p-5">
              <div className="font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
                Band
              </div>
              <div className="mt-2 text-2xl font-light text-led">{b.k}</div>
              <div className="mt-1 font-mono text-xs text-mist">{b.d}</div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-mist">
          Mock LightGBM metrics on the current optical stack live with the
          hardware.{" "}
          <a href="#poc" className="text-led hover:underline">
            Open the prototype bench →
          </a>
        </p>
      </div>
    </section>
  );
}
