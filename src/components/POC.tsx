import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ADS_MV_PER_LSB,
  bandRange,
  bom,
  confusion,
  featureImportance,
  modelMetrics,
  nirMv,
  nirRatio,
  pins,
  pocSamples,
  protoPipeline,
  type GlucoseBand,
  type PocSample,
} from "../data/poc";
import { PcbVisual } from "./ProductFrames";

const BANDS: GlucoseBand[] = ["Low", "In range", "Elevated", "High"];

function bandClass(band: GlucoseBand) {
  if (band === "Low") return "text-cyan";
  if (band === "In range") return "text-led";
  if (band === "Elevated") return "text-gold";
  return "text-warn";
}

function useSerial() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % pocSamples.length), 1100);
    return () => window.clearInterval(id);
  }, []);
  return pocSamples[i];
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="hud-border rounded-2xl p-5">
      <div className="font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
        {label}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-light text-led glow-led">{value}</span>
        <span className="mb-1 font-mono text-xs text-mist">{unit}</span>
      </div>
    </div>
  );
}

const AXIS_MIN = 60;
const AXIS_MAX = 200;
const toPlot = (v: number) => ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100;

function SessionChart() {
  const w = 760;
  const h = 200;
  const pad = 28;
  const xs = pocSamples.map((_, i) => pad + (i * (w - pad * 2)) / (pocSamples.length - 1));
  const gMin = 70;
  const gMax = 190;
  const gy = (v: number) => pad + (1 - (v - gMin) / (gMax - gMin)) * (h - pad * 2);
  const path = (key: "ref" | "pred") =>
    pocSamples.map((d, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${gy(d[key])}`).join(" ");
  const bpmPath = pocSamples
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${gy(60 + (d.bpm - 60) * 2.2)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="rgba(126,231,255,0.08)"
        />
      ))}
      <path d={bpmPath} fill="none" stroke="#7ee7ff" strokeWidth="1.3" strokeDasharray="5 4" />
      <path d={path("ref")} fill="none" stroke="#c4a574" strokeWidth="2" />
      <path d={path("pred")} fill="none" stroke="#3dff8a" strokeWidth="2.2" />
      {pocSamples.map((d, i) => (
        <text
          key={d.id}
          x={xs[i]}
          y={h - 8}
          textAnchor="middle"
          fill="#9aa3ad"
          fontSize="9"
          fontFamily="IBM Plex Mono"
        >
          {i % 4 === 0 ? d.time : ""}
        </text>
      ))}
    </svg>
  );
}

function ScatterPlot() {
  return (
    <svg viewBox="0 0 100 72" className="h-full w-full">
      <line x1="8" y1="64" x2="96" y2="64" stroke="rgba(126,231,255,0.2)" />
      <line x1="8" y1="8" x2="8" y2="64" stroke="rgba(126,231,255,0.2)" />
      <line
        x1={8 + (toPlot(70) / 100) * 88}
        y1={64 - (toPlot(70) / 100) * 56}
        x2={8 + (toPlot(180) / 100) * 88}
        y2={64 - (toPlot(180) / 100) * 56}
        stroke="#c4a574"
        strokeWidth="0.4"
        strokeDasharray="1.2 1"
      />
      {pocSamples.map((d) => (
        <circle
          key={d.id}
          cx={8 + (toPlot(d.ref) / 100) * 88}
          cy={64 - (toPlot(d.pred) / 100) * 56}
          r="1.2"
          fill="#3dff8a"
        />
      ))}
      <text x="8" y="70" fill="#9aa3ad" fontSize="3" fontFamily="IBM Plex Mono">
        Glucometer →
      </text>
    </svg>
  );
}

function serialLine(s: PocSample) {
  return `${s.id * 10000},${s.maxRed},${s.maxIr},${s.nir1Raw},${s.nir2Raw},${s.skinTempC.toFixed(2)},${s.hbtAdc},${s.bpm}`;
}

export default function POC() {
  const live = useSerial();
  const rows = pocSamples;
  const logStart = Math.max(0, live.id - 5);

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
            04 — Hackathon prototype
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            NIO-GM: the bench that trains the ring.
          </h2>
          <p className="mt-5 max-w-2xl text-mist">
            Same sensing physics as the product — PPG, dual NIR, heart rate, skin
            temperature — on an ESP32-S3 fixture. Values below are unit-correct
            mock windows that show how fusion maps to a glucose band.
          </p>
        </motion.div>

        <div className="hud-border mt-10 rounded-2xl p-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-gold uppercase">
            Wavelength note
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-mist">
            Glucose has combination bands near 1500–1700 nm. This BOM uses
            MAX30102 red/IR (660 / 880 nm) plus NIR emitters short of that SWIR
            window. The InGaAs detector can see longer wavelengths; these LEDs
            do not emit there. The prototype is a multi-sensor fusion demo — not
            clinical spectroscopy.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hud-border overflow-hidden rounded-2xl">
            <PcbVisual />
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
              <div className="mb-4 flex items-center justify-between">
                <div className="font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
                  OLED · GLUCOSE MONITOR
                </div>
                <span className="font-mono text-[10px] tracking-widest text-gold uppercase">
                  Mock stream
                </span>
              </div>
              <div className="rounded-xl bg-black p-5 font-mono text-sm leading-7 text-led shadow-[inset_0_0_40px_rgba(61,255,138,0.12)]">
                <div>GLUCOEDGE NIO-GM</div>
                <div className="tracking-[0.4em]">---------------------</div>
                <div>IR&nbsp;&nbsp;: {live.maxIr.toLocaleString()} cnt</div>
                <div>Red : {live.maxRed.toLocaleString()} cnt</div>
                <div>
                  NIR1: {live.nir1Raw} ({nirMv(live.nir1Raw).toFixed(1)} mV)
                </div>
                <div>
                  NIR2: {live.nir2Raw} ({nirMv(live.nir2Raw).toFixed(1)} mV)
                </div>
                <div>Temp: {live.skinTempC.toFixed(2)} °C</div>
                <div>
                  HBT : {live.bpm} BPM · ADC {live.hbtAdc}
                </div>
                <div className={`mt-2 ${bandClass(live.bandPred)}`}>
                  {live.bandPred.toUpperCase()} · {live.pred} mg/dL
                </div>
                <div className="text-gold">
                  STICK {live.ref} · {live.bandTrue.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="hud-border rounded-2xl p-5">
              <div className="mb-3 font-mono text-[10px] tracking-[0.28em] text-mist uppercase">
                Serial @ 115200 · ~100 Hz
              </div>
              <p className="mb-2 font-mono text-[10px] text-mist">
                millis,max_red,max_ir,nir1_raw,nir2_raw,skin_temp_c,hbt_adc,bpm
              </p>
              <div className="space-y-1 font-mono text-[11px] text-led/90">
                {pocSamples.slice(logStart, live.id).map((s) => (
                  <div key={s.id} className="truncate opacity-55">
                    {serialLine(s)}
                  </div>
                ))}
                <div className="truncate">
                  {serialLine(live)}
                  <span className="ml-1 animate-pulse">█</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Metric label="Band accuracy" value={`${modelMetrics.bandAccPct}%`} unit="mock labels" />
          <Metric label="MAE vs stick" value={`${modelMetrics.mae}`} unit="mg/dL" />
          <Metric label="Paired windows" value={`${modelMetrics.n}`} unit={`${modelMetrics.windowSec} s each`} />
          <Metric label="Pearson r" value={`${modelMetrics.r}`} unit="pred ~ ref" />
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-mist uppercase">
          Illustrative fusion session · ADS1115 {ADS_MV_PER_LSB} mV/LSB · not a clinical study
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {protoPipeline.map((item, i) => (
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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="hud-border rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-light">Band confusion</h3>
              <span className="font-mono text-[10px] tracking-widest text-mist uppercase">
                True ↓ · Pred →
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono text-[11px]">
                <thead>
                  <tr>
                    <th className="p-2 text-mist" />
                    {BANDS.map((b) => (
                      <th key={b} className="p-2 text-mist">
                        {b}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BANDS.map((trueBand, i) => (
                    <tr key={trueBand}>
                      <td className="p-2 text-left text-mist">{trueBand}</td>
                      {confusion[i].map((c, j) => (
                        <td
                          key={BANDS[j]}
                          className={`p-2 ${i === j ? "text-led" : "text-white/70"}`}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-mist">
              {BANDS.map((b) => `${b} ${bandRange[b]}`).join(" · ")}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="hud-border rounded-2xl p-5">
              <h3 className="mb-2 text-lg font-light">Predicted vs reference</h3>
              <p className="mb-3 font-mono text-[10px] tracking-widest text-mist uppercase">
                Gold dashed = identity · mock mg/dL
              </p>
              <div className="h-56">
                <ScatterPlot />
              </div>
            </div>
            <div className="hud-border rounded-2xl p-5">
              <h3 className="mb-4 text-lg font-light">Feature importance</h3>
              <div className="space-y-3">
                {featureImportance.map((f, i) => (
                  <div key={f.name}>
                    <div className="mb-1 flex justify-between font-mono text-[11px]">
                      <span className="text-white/80">
                        {f.name} <span className="text-mist">· {f.note}</span>
                      </span>
                      <span className="text-led">{f.value}%</span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.08 }}
                        className="h-full bg-led"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hud-border mt-6 rounded-2xl p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-lg font-light">Same-day mock session</h3>
            <div className="flex gap-4 font-mono text-[10px] tracking-widest uppercase">
              <span className="text-gold">Glucometer</span>
              <span className="text-led">GlucoEdge</span>
              <span className="text-cyan">BPM (scaled)</span>
              <span className="text-mist">RMSE {modelMetrics.rmse} mg/dL</span>
            </div>
          </div>
          <div className="h-64">
            <SessionChart />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="hud-border rounded-2xl p-6">
            <h3 className="text-lg font-light">Pin map · ESP32-S3</h3>
            <div className="mt-5 space-y-3">
              {pins.map((p) => (
                <div
                  key={p.pin}
                  className="flex items-center justify-between gap-2 border-b border-white/8 pb-3 font-mono text-[12px]"
                >
                  <span className="text-led">{p.pin}</span>
                  <span className="text-cyan">{p.sig}</span>
                  <span className="text-right text-mist">{p.to}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              Firmware currently logs red, IR, NIR1, NIR2, and temp at ~100 Hz
              with IR contact gating. The HUD here also streams HBT V2 BPM as
              the bench would once GPIO 7 is on the serial frame.
            </p>
          </div>

          <div className="hud-border overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <h3 className="text-lg font-light">Paired prototype table</h3>
              <span className="font-mono text-[10px] tracking-widest text-mist uppercase">
                10 s windows
              </span>
            </div>
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full min-w-[920px] text-left font-mono text-[12px]">
                <thead className="sticky top-0 bg-panel text-[10px] tracking-[0.18em] text-mist uppercase">
                  <tr>
                    {[
                      "Time",
                      "IR",
                      "Red",
                      "NIR1",
                      "NIR2",
                      "°C",
                      "BPM",
                      "Band",
                      "Pred",
                      "Stick",
                    ].map((h) => (
                      <th key={h} className="px-3 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-t border-white/6 ${live.id === s.id ? "bg-led/8" : ""}`}
                    >
                      <td className="px-3 py-2.5 text-mist">{s.time}</td>
                      <td className="px-3 py-2.5">{s.maxIr.toLocaleString()}</td>
                      <td className="px-3 py-2.5">{s.maxRed.toLocaleString()}</td>
                      <td className="px-3 py-2.5">{s.nir1Raw}</td>
                      <td className="px-3 py-2.5">{s.nir2Raw}</td>
                      <td className="px-3 py-2.5">{s.skinTempC.toFixed(1)}</td>
                      <td className="px-3 py-2.5">{s.bpm}</td>
                      <td className={`px-3 py-2.5 ${bandClass(s.bandPred)}`}>
                        {s.bandPred}
                      </td>
                      <td className="px-3 py-2.5 text-led">{s.pred}</td>
                      <td className="px-3 py-2.5 text-gold">{s.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-white/8 px-5 py-3 font-mono text-[10px] text-mist">
              NIR counts are dark-subtracted ADS1115 LSBs · × {ADS_MV_PER_LSB} = mV at
              TIA · ratio {nirRatio(live).toFixed(3)} on the live row
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Protocol",
              d: "Finger on the optical window for 10 s. Features from MAX30102, dual NIR, HBT V2, and DS18B20. Mock fingerstick label aligned to that window.",
            },
            {
              t: "What we measure",
              d: "18-bit red/IR counts, NIR reflectance in mV, analog PPG → BPM/IBI, skin °C. No enzyme strip. No interstitial filament.",
            },
            {
              t: "What success looks like",
              d: "A fusion stack that classifies glucose bands consistently across fasting, post-meal, and evening — then miniaturizes into the ring.",
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
