import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { bom, pocSamples } from "../data/poc";

const pins = [
  { pin: "GPIO 8", sig: "SDA", to: "MAX30102 + OLED" },
  { pin: "GPIO 9", sig: "SCL", to: "I2C 400 kHz" },
  { pin: "GPIO 4", sig: "1-Wire", to: "DS18B20 Temp" },
  { pin: "0x3C", sig: "OLED", to: "SSD1306 128×64" },
  { pin: "UART", sig: "115200", to: "IR, Red, Temp log" },
];

function useSerial() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % pocSamples.length), 900);
    return () => window.clearInterval(id);
  }, []);
  return pocSamples[i];
}

export default function POC() {
  const live = useSerial();
  const rows = pocSamples.slice(0, 8);

  return (
    <section id="poc" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-[11px] tracking-[0.4em] text-led uppercase">
            04 — Proof of concept
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            The lab rig that trains the ring.
          </h2>
          <p className="mt-5 max-w-2xl text-mist">
            Before the sealed product, the same sensing physics runs on an
            ESP32-S3 bench setup: MAX30102 PPG, DS18B20 temperature, OLED HUD,
            and a fingerstick glucometer as ground truth.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hud-border overflow-hidden rounded-2xl">
            <img
              src="/stills/pcb.jpg"
              alt="GlucoEdge sensing electronics"
              className="h-56 w-full object-cover md:h-72"
            />
            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {bom.map((item) => (
                <div key={item.part} className="bg-panel p-5">
                  <div className="font-mono text-[10px] tracking-[0.24em] text-led uppercase">
                    {item.role}
                  </div>
                  <div className="mt-1 text-xl font-light">{item.part}</div>
                  <div className="mt-2 font-mono text-[11px] text-cyan">{item.bus}</div>
                  <p className="mt-2 text-sm text-mist">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="hud-border rounded-2xl p-5">
              <div className="mb-4 font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
                OLED · GLUCOSE MONITOR
              </div>
              <div className="rounded-xl bg-black p-5 font-mono text-sm leading-7 text-led shadow-[inset_0_0_40px_rgba(61,255,138,0.12)]">
                <div>GLUCOSE MONITOR</div>
                <div className="tracking-[0.4em]">---------------------</div>
                <div>IR&nbsp;&nbsp;: {live.ir}</div>
                <div>Red : {live.red}</div>
                <div>Temp: {live.temp.toFixed(2)} C</div>
                <div className="mt-2 text-cyan">
                  PRED {live.pred} mg/dL · REF {live.ref}
                </div>
              </div>
            </div>

            <div className="hud-border rounded-2xl p-5">
              <div className="mb-3 font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
                Serial @ 115200
              </div>
              <div className="space-y-1 font-mono text-[12px] text-led/90">
                {pocSamples.slice(Math.max(0, live.id - 4), live.id).map((s) => (
                  <div key={s.id} className="opacity-55">
                    IR:{s.ir},Red:{s.red},Temp:{s.temp.toFixed(2)}
                  </div>
                ))}
                <div>
                  IR:{live.ir},Red:{live.red},Temp:{live.temp.toFixed(2)}
                  <span className="ml-1 animate-pulse">█</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="hud-border rounded-2xl p-6">
            <h3 className="text-lg font-light">Pin map · ESP32-S3</h3>
            <div className="mt-5 space-y-3">
              {pins.map((p) => (
                <div
                  key={p.pin}
                  className="flex items-center justify-between border-b border-white/8 pb-3 font-mono text-[12px]"
                >
                  <span className="text-led">{p.pin}</span>
                  <span className="text-cyan">{p.sig}</span>
                  <span className="text-mist">{p.to}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              Firmware streams raw IR, Red, and Temp at ~10 Hz. Contact is
              gated on IR intensity. Each labeled sample is a 10-second optical
              window aligned to one glucometer stick.
            </p>
          </div>

          <div className="hud-border overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <h3 className="text-lg font-light">Paired POC table</h3>
              <span className="font-mono text-[10px] tracking-widest text-mist uppercase">
                Optical + thermal vs stick
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left font-mono text-[12px]">
                <thead className="text-[10px] tracking-[0.18em] text-mist uppercase">
                  <tr>
                    {["Time", "IR", "Red", "Temp °C", "Pred", "Glucometer", "Δ"].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 font-medium">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} className="border-t border-white/6">
                      <td className="px-4 py-2.5 text-mist">{s.time}</td>
                      <td className="px-4 py-2.5">{s.ir.toLocaleString()}</td>
                      <td className="px-4 py-2.5">{s.red.toLocaleString()}</td>
                      <td className="px-4 py-2.5">{s.temp.toFixed(1)}</td>
                      <td className="px-4 py-2.5 text-led">{s.pred}</td>
                      <td className="px-4 py-2.5 text-gold">{s.ref}</td>
                      <td className="px-4 py-2.5 text-cyan">
                        {s.pred - s.ref > 0 ? "+" : ""}
                        {s.pred - s.ref}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Protocol",
              d: "Finger on the optical window for 10 s. Immediate fingerstick on a clinical glucometer. Pair IR / Red / Temp features to that label.",
            },
            {
              t: "What we measure",
              d: "Transmitted and reflected PPG at 880 nm and 660 nm, plus skin temperature. No enzyme strip. No interstitial filament.",
            },
            {
              t: "What success looks like",
              d: "Predictions that stay in Clarke Zone A against the glucometer across fasting, post-meal, and evening sessions.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.t}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="hud-border rounded-2xl p-6"
            >
              <div className="font-mono text-[11px] tracking-[0.24em] text-led uppercase">
                {card.t}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist">{card.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
