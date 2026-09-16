import { motion } from "framer-motion";
import {
  featureImportance,
  modelMetrics,
  pipeline,
  pocSamples,
} from "../data/poc";

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
const AXIS_MAX = 230;
const toPlot = (v: number) => ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100;

function ClarkeGrid() {
  const ticks = [70, 100, 130, 160, 190];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect width="100" height="100" fill="#070b10" />
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={toPlot(v)}
            y1="8"
            x2={toPlot(v)}
            y2="92"
            stroke="rgba(126,231,255,0.08)"
          />
          <line
            x1="8"
            y1={100 - toPlot(v)}
            x2="92"
            y2={100 - toPlot(v)}
            stroke="rgba(126,231,255,0.08)"
          />
        </g>
      ))}
      <line
        x1={toPlot(70)}
        y1={100 - toPlot(70)}
        x2={toPlot(200)}
        y2={100 - toPlot(200)}
        stroke="#7ee7ff"
        strokeWidth="0.35"
      />
      <line
        x1={toPlot(70)}
        y1={100 - toPlot(84)}
        x2={toPlot(175)}
        y2={100 - toPlot(210)}
        stroke="#3dff8a"
        strokeWidth="0.3"
        strokeDasharray="1.4 1"
      />
      <line
        x1={toPlot(84)}
        y1={100 - toPlot(70)}
        x2={toPlot(210)}
        y2={100 - toPlot(175)}
        stroke="#3dff8a"
        strokeWidth="0.3"
        strokeDasharray="1.4 1"
      />
      {pocSamples.map((d) => (
        <circle
          key={d.id}
          cx={toPlot(d.ref)}
          cy={100 - toPlot(d.pred)}
          r="1.35"
          fill="#3dff8a"
        />
      ))}
      <text x="10" y="7" fill="#9aa3ad" fontSize="3.1" fontFamily="IBM Plex Mono">
        PRED mg/dL
      </text>
      <text x="70" y="98" fill="#9aa3ad" fontSize="3.1" fontFamily="IBM Plex Mono">
        REF mg/dL
      </text>
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
        x2={8 + (toPlot(200) / 100) * 88}
        y2={64 - (toPlot(200) / 100) * 56}
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

function SessionChart() {
  const w = 760;
  const h = 200;
  const pad = 28;
  const xs = pocSamples.map((_, i) => pad + (i * (w - pad * 2)) / (pocSamples.length - 1));
  const gMin = 60;
  const gMax = 230;
  const irMin = 70000;
  const irMax = 115000;
  const gy = (v: number) => pad + (1 - (v - gMin) / (gMax - gMin)) * (h - pad * 2);
  const iry = (v: number) => pad + (1 - (v - irMin) / (irMax - irMin)) * (h - pad * 2);
  const path = (key: "ref" | "pred") =>
    pocSamples.map((d, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${gy(d[key])}`).join(" ");
  const irPath = pocSamples
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${iry(d.ir)}`)
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
      <path d={irPath} fill="none" stroke="#7ee7ff" strokeWidth="1.4" strokeDasharray="5 4" />
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
          {i % 3 === 0 ? d.time : ""}
        </text>
      ))}
    </svg>
  );
}

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
            Optical features in. Glucometer labels out.
          </h2>
          <p className="mt-5 max-w-2xl text-mist">
            The model never sees a blood drop. It sees IR and red PPG plus
            temperature. Training and evaluation are always paired with a real
            fingerstick reading taken in the same minute.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <Metric label="Paired samples" value={`${modelMetrics.n}`} unit="n" />
          <Metric label="MAE vs stick" value={`${modelMetrics.mae}`} unit="mg/dL" />
          <Metric label="Pearson r" value={`${modelMetrics.r}`} unit="pred ~ ref" />
          <Metric label="Clarke A" value={`${modelMetrics.zoneAPct}%`} unit={`${modelMetrics.zoneBPct}% zone B`} />
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-mist uppercase">
          Illustrative paired bench set vs fingerstick · replace with your logged CSV
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {pipeline.map((item, i) => (
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
              <h3 className="text-lg font-light">Clarke error grid</h3>
              <span className="font-mono text-[10px] tracking-widest text-mist uppercase">
                Zone A {modelMetrics.zoneAPct}% · B {modelMetrics.zoneBPct}%
              </span>
            </div>
            <div className="aspect-square overflow-hidden rounded-xl">
              <ClarkeGrid />
            </div>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-mist">
              Each point is one GlucoEdge estimate plotted against a same-minute
              glucometer reading. Zone A is within 20% of reference.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="hud-border rounded-2xl p-5">
              <h3 className="mb-2 text-lg font-light">Predicted vs reference</h3>
              <p className="mb-3 font-mono text-[10px] tracking-widest text-mist uppercase">
                Gold dashed = identity line
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
            <h3 className="text-lg font-light">Same-day paired session</h3>
            <div className="flex gap-4 font-mono text-[10px] tracking-widest uppercase">
              <span className="text-gold">Glucometer</span>
              <span className="text-led">GlucoEdge</span>
              <span className="text-cyan">IR</span>
              <span className="text-mist">RMSE {modelMetrics.rmse} mg/dL</span>
            </div>
          </div>
          <div className="h-64">
            <SessionChart />
          </div>
        </div>
      </div>
    </section>
  );
}
