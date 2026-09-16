export type GlucoseBand = "Low" | "In range" | "Elevated" | "High";

export type PocSample = {
  id: number;
  time: string;
  maxIr: number;
  maxRed: number;
  spo2: number;
  hrPpg: number;
  hbtAdc: number;
  bpm: number;
  ibiMs: number;
  nir1Raw: number;
  nir2Raw: number;
  skinTempC: number;
  ref: number;
  pred: number;
  bandTrue: GlucoseBand;
  bandPred: GlucoseBand;
};

export const bandRange: Record<GlucoseBand, string> = {
  Low: "<70 mg/dL",
  "In range": "70–99 mg/dL",
  Elevated: "100–125 mg/dL",
  High: "≥126 mg/dL",
};

export function bandFromMgdl(mgdl: number): GlucoseBand {
  if (mgdl < 70) return "Low";
  if (mgdl < 100) return "In range";
  if (mgdl < 126) return "Elevated";
  return "High";
}

export const ADS_MV_PER_LSB = 0.125;

export function nirMv(raw: number): number {
  return raw * ADS_MV_PER_LSB;
}

export function nirRatio(s: PocSample): number {
  return s.nir1Raw / s.nir2Raw;
}

const rows: Omit<PocSample, "bandTrue" | "bandPred">[] = [
  { id: 1, time: "07:28", maxIr: 114210, maxRed: 55240, spo2: 98.4, hrPpg: 58, hbtAdc: 590, bpm: 57, ibiMs: 1053, nir1Raw: 1988, nir2Raw: 1920, skinTempC: 32.4, ref: 66, pred: 69 },
  { id: 2, time: "07:52", maxIr: 110410, maxRed: 54110, spo2: 98.0, hrPpg: 64, hbtAdc: 628, bpm: 63, ibiMs: 952, nir1Raw: 2218, nir2Raw: 2010, skinTempC: 32.8, ref: 88, pred: 84 },
  { id: 3, time: "08:18", maxIr: 107960, maxRed: 53240, spo2: 97.9, hrPpg: 66, hbtAdc: 641, bpm: 65, ibiMs: 923, nir1Raw: 2294, nir2Raw: 2042, skinTempC: 33.0, ref: 94, pred: 97 },
  { id: 4, time: "08:44", maxIr: 104210, maxRed: 51980, spo2: 97.7, hrPpg: 70, hbtAdc: 668, bpm: 69, ibiMs: 870, nir1Raw: 2410, nir2Raw: 2088, skinTempC: 33.2, ref: 101, pred: 96 },
  { id: 5, time: "09:12", maxIr: 98640, maxRed: 50210, spo2: 97.4, hrPpg: 74, hbtAdc: 702, bpm: 73, ibiMs: 822, nir1Raw: 2588, nir2Raw: 2164, skinTempC: 33.5, ref: 118, pred: 121 },
  { id: 6, time: "09:40", maxIr: 94120, maxRed: 48900, spo2: 97.1, hrPpg: 76, hbtAdc: 718, bpm: 76, ibiMs: 789, nir1Raw: 2724, nir2Raw: 2210, skinTempC: 33.7, ref: 132, pred: 128 },
  { id: 7, time: "10:08", maxIr: 91280, maxRed: 47650, spo2: 96.9, hrPpg: 78, hbtAdc: 734, bpm: 77, ibiMs: 779, nir1Raw: 2810, nir2Raw: 2248, skinTempC: 33.9, ref: 141, pred: 146 },
  { id: 8, time: "10:36", maxIr: 88910, maxRed: 46880, spo2: 97.0, hrPpg: 75, hbtAdc: 721, bpm: 74, ibiMs: 811, nir1Raw: 2746, nir2Raw: 2222, skinTempC: 33.8, ref: 128, pred: 124 },
  { id: 9, time: "11:05", maxIr: 87410, maxRed: 46120, spo2: 97.2, hrPpg: 72, hbtAdc: 698, bpm: 71, ibiMs: 845, nir1Raw: 2662, nir2Raw: 2184, skinTempC: 33.6, ref: 115, pred: 119 },
  { id: 10, time: "11:34", maxIr: 90180, maxRed: 47040, spo2: 97.3, hrPpg: 70, hbtAdc: 682, bpm: 69, ibiMs: 870, nir1Raw: 2548, nir2Raw: 2140, skinTempC: 33.5, ref: 108, pred: 104 },
  { id: 11, time: "12:08", maxIr: 84670, maxRed: 45320, spo2: 97.0, hrPpg: 76, hbtAdc: 726, bpm: 75, ibiMs: 800, nir1Raw: 2788, nir2Raw: 2236, skinTempC: 34.0, ref: 122, pred: 126 },
  { id: 12, time: "12:36", maxIr: 80110, maxRed: 43840, spo2: 96.8, hrPpg: 80, hbtAdc: 754, bpm: 79, ibiMs: 759, nir1Raw: 2964, nir2Raw: 2310, skinTempC: 34.3, ref: 148, pred: 143 },
  { id: 13, time: "13:04", maxIr: 77840, maxRed: 42910, spo2: 96.6, hrPpg: 82, hbtAdc: 768, bpm: 81, ibiMs: 741, nir1Raw: 3088, nir2Raw: 2354, skinTempC: 34.5, ref: 156, pred: 161 },
  { id: 14, time: "13:32", maxIr: 81220, maxRed: 44100, spo2: 96.9, hrPpg: 78, hbtAdc: 742, bpm: 77, ibiMs: 779, nir1Raw: 2910, nir2Raw: 2288, skinTempC: 34.2, ref: 139, pred: 135 },
  { id: 15, time: "14:02", maxIr: 84670, maxRed: 45320, spo2: 97.1, hrPpg: 74, hbtAdc: 710, bpm: 73, ibiMs: 822, nir1Raw: 2754, nir2Raw: 2218, skinTempC: 34.0, ref: 124, pred: 121 },
  { id: 16, time: "14:30", maxIr: 88910, maxRed: 46880, spo2: 97.3, hrPpg: 71, hbtAdc: 688, bpm: 70, ibiMs: 857, nir1Raw: 2612, nir2Raw: 2166, skinTempC: 33.8, ref: 112, pred: 116 },
  { id: 17, time: "15:00", maxIr: 92340, maxRed: 48110, spo2: 97.5, hrPpg: 68, hbtAdc: 664, bpm: 67, ibiMs: 896, nir1Raw: 2488, nir2Raw: 2114, skinTempC: 33.6, ref: 104, pred: 99 },
  { id: 18, time: "15:28", maxIr: 96110, maxRed: 49540, spo2: 97.6, hrPpg: 66, hbtAdc: 648, bpm: 65, ibiMs: 923, nir1Raw: 2364, nir2Raw: 2068, skinTempC: 33.5, ref: 98, pred: 101 },
  { id: 19, time: "16:02", maxIr: 100280, maxRed: 50880, spo2: 97.8, hrPpg: 64, hbtAdc: 632, bpm: 63, ibiMs: 952, nir1Raw: 2260, nir2Raw: 2026, skinTempC: 33.3, ref: 92, pred: 88 },
  { id: 20, time: "16:36", maxIr: 103450, maxRed: 52100, spo2: 98.0, hrPpg: 63, hbtAdc: 620, bpm: 62, ibiMs: 968, nir1Raw: 2188, nir2Raw: 1994, skinTempC: 33.1, ref: 89, pred: 91 },
  { id: 21, time: "17:10", maxIr: 105880, maxRed: 52840, spo2: 98.1, hrPpg: 65, hbtAdc: 636, bpm: 64, ibiMs: 938, nir1Raw: 2234, nir2Raw: 2018, skinTempC: 33.2, ref: 95, pred: 93 },
  { id: 22, time: "17:48", maxIr: 101120, maxRed: 51220, spo2: 97.7, hrPpg: 71, hbtAdc: 690, bpm: 70, ibiMs: 857, nir1Raw: 2448, nir2Raw: 2102, skinTempC: 33.6, ref: 110, pred: 114 },
  { id: 23, time: "18:22", maxIr: 88770, maxRed: 46420, spo2: 97.0, hrPpg: 77, hbtAdc: 738, bpm: 76, ibiMs: 789, nir1Raw: 2844, nir2Raw: 2260, skinTempC: 34.1, ref: 138, pred: 133 },
  { id: 24, time: "18:50", maxIr: 75420, maxRed: 41880, spo2: 96.5, hrPpg: 84, hbtAdc: 782, bpm: 83, ibiMs: 723, nir1Raw: 3188, nir2Raw: 2398, skinTempC: 34.6, ref: 162, pred: 168 },
  { id: 25, time: "19:18", maxIr: 72110, maxRed: 40940, spo2: 96.4, hrPpg: 86, hbtAdc: 798, bpm: 85, ibiMs: 706, nir1Raw: 3310, nir2Raw: 2442, skinTempC: 34.8, ref: 171, pred: 166 },
  { id: 26, time: "19:46", maxIr: 76880, maxRed: 42200, spo2: 96.7, hrPpg: 81, hbtAdc: 764, bpm: 80, ibiMs: 750, nir1Raw: 3046, nir2Raw: 2340, skinTempC: 34.5, ref: 158, pred: 152 },
  { id: 27, time: "20:16", maxIr: 83440, maxRed: 44780, spo2: 97.0, hrPpg: 76, hbtAdc: 728, bpm: 75, ibiMs: 800, nir1Raw: 2798, nir2Raw: 2244, skinTempC: 34.2, ref: 142, pred: 146 },
  { id: 28, time: "20:48", maxIr: 87220, maxRed: 45860, spo2: 97.2, hrPpg: 73, hbtAdc: 704, bpm: 72, ibiMs: 833, nir1Raw: 2668, nir2Raw: 2188, skinTempC: 33.9, ref: 126, pred: 122 },
  { id: 29, time: "21:22", maxIr: 90560, maxRed: 47210, spo2: 97.4, hrPpg: 70, hbtAdc: 676, bpm: 69, ibiMs: 870, nir1Raw: 2524, nir2Raw: 2132, skinTempC: 33.7, ref: 114, pred: 109 },
  { id: 30, time: "21:58", maxIr: 97220, maxRed: 49980, spo2: 97.8, hrPpg: 66, hbtAdc: 644, bpm: 65, ibiMs: 923, nir1Raw: 2320, nir2Raw: 2054, skinTempC: 33.4, ref: 99, pred: 102 },
];

export const pocSamples: PocSample[] = rows.map((r) => ({
  ...r,
  bandTrue: bandFromMgdl(r.ref),
  bandPred: bandFromMgdl(r.pred),
}));

const n = pocSamples.length;
const mae =
  pocSamples.reduce((sum, d) => sum + Math.abs(d.pred - d.ref), 0) / n;
const rmse = Math.sqrt(
  pocSamples.reduce((sum, d) => sum + (d.pred - d.ref) ** 2, 0) / n,
);
const meanRef = pocSamples.reduce((sum, d) => sum + d.ref, 0) / n;
const meanPred = pocSamples.reduce((sum, d) => sum + d.pred, 0) / n;
const rNum = pocSamples.reduce(
  (sum, d) => sum + (d.ref - meanRef) * (d.pred - meanPred),
  0,
);
const rDen = Math.sqrt(
  pocSamples.reduce((sum, d) => sum + (d.ref - meanRef) ** 2, 0) *
    pocSamples.reduce((sum, d) => sum + (d.pred - meanPred) ** 2, 0),
);
const r = rNum / rDen;

const inZoneA = (d: PocSample) => Math.abs(d.pred - d.ref) <= 0.2 * d.ref;
const zoneA = pocSamples.filter(inZoneA).length;
const bandHits = pocSamples.filter((d) => d.bandPred === d.bandTrue).length;

const bands: GlucoseBand[] = ["Low", "In range", "Elevated", "High"];
export const confusion = bands.map((trueBand) =>
  bands.map(
    (predBand) =>
      pocSamples.filter((d) => d.bandTrue === trueBand && d.bandPred === predBand)
        .length,
  ),
);

export const modelMetrics = {
  n,
  mae: Number(mae.toFixed(1)),
  rmse: Number(rmse.toFixed(1)),
  r: Number(r.toFixed(2)),
  zoneAPct: Number(((zoneA / n) * 100).toFixed(0)),
  zoneBPct: Number((((n - zoneA) / n) * 100).toFixed(0)),
  bandAccPct: Number(((bandHits / n) * 100).toFixed(0)),
  subjects: 1,
  windowSec: 10,
  sampleHz: 100,
};

export const featureImportance = [
  { name: "NIR λ1 / λ2 ratio", value: 31, note: "dual emitter + InGaAs" },
  { name: "IR AC / DC", value: 22, note: "MAX30102 880 nm" },
  { name: "HBT perfusion + BPM", value: 18, note: "HBT V2 analog PPG" },
  { name: "Skin temperature", value: 15, note: "DS18B20" },
  { name: "IR / Red ratio", value: 9, note: "tissue compensation" },
  { name: "Red AC / DC", value: 5, note: "MAX30102 660 nm" },
];

export const modelChoice = {
  name: "LightGBM",
  family: "Gradient-boosted decision trees",
  primary: "Multiclass band classifier",
  secondary: "Huber regressor for mg/dL",
  why: [
    {
      t: "Tabular, not pixels",
      d: "A 10-second window collapses to a small feature vector — AC/DC ratios, NIR1/NIR2, EIS, BPM, skin °C. Trees split that mix without needing a CNN on raw PPG.",
    },
    {
      t: "Small labeled n",
      d: "Fingerstick-paired windows are scarce. Boosted trees regularize well on tens-to-hundreds of rows; a deep net would overfit the same set.",
    },
    {
      t: "Nonlinear fusion",
      d: "Temperature, perfusion, and impedance interact. LightGBM learns those couplings without assuming a linear mg/dL mapping that optics cannot support.",
    },
    {
      t: "Fits the ring",
      d: "The forest is distillable to a few hundred shallow trees — small enough for on-device inference, with feature importances we can actually show.",
    },
  ],
};

export const productPipeline = [
  {
    step: "01",
    title: "Contact lock",
    body: "The inner optical window seats on capillary tissue. Light return gates a valid wear so air and motion never become a reading.",
  },
  {
    step: "02",
    title: "Optical window",
    body: "A 10-second capture fuses dual near-infrared reflectance with red/IR photoplethysmography from the same finger bed.",
  },
  {
    step: "03",
    title: "Impedance path",
    body: "Skin-contact electrodes read electrical impedance through the same tissue, adding a non-optical channel the sealed ring can fuse with PPG.",
  },
  {
    step: "04",
    title: "Thermal correction",
    body: "Skin temperature rescales LED efficiency and optical path length so heat is not mistaken for sugar.",
  },
  {
    step: "05",
    title: "LightGBM fusion",
    body: "A gradient-boosted tree classifier maps the vector to a glucose band. A second LightGBM head emits illustrative mg/dL. Chosen over a neural net because the input is tabular and the labeled set is small.",
  },
  {
    step: "06",
    title: "Band, not a lab printout",
    body: "Low, in range, elevated, or high. The number is context. The band is the decision.",
  },
];

export const protoPipeline = [
  {
    step: "01",
    title: "Contact lock",
    body: "MAX30102 IR intensity above ~50k counts gates a valid finger. Below that, firmware drops the row as air or motion.",
  },
  {
    step: "02",
    title: "100 Hz capture",
    body: "ESP32-S3 streams a 10-second window: red/IR PPG, two pulsed NIR channels on ADS1115, HBT V2 analog PPG, DS18B20 at 1 Hz.",
  },
  {
    step: "03",
    title: "Signal split",
    body: "Bandpass isolation of pulsatile AC versus tissue DC. HBT peaks yield BPM and IBI. Motion spikes are clipped before features.",
  },
  {
    step: "04",
    title: "Thermal + dual-λ",
    body: "Skin °C and the NIR1/NIR2 ratio compensate path length and LED drive so temperature and wavelength drift are features, not glucose.",
  },
  {
    step: "05",
    title: "LightGBM dual head",
    body: "LightGBM classifies Low / In range / Elevated / High from the fused vector, with a Huber-regressed mg/dL head for the HUD. Trees beat a tiny MLP here: mixed units, small n, readable importances.",
  },
  {
    step: "06",
    title: "Mock paired labels",
    body: "This demo session is synthetic but unit-correct. Each window is treated as if a fingerstick were taken in the same minute.",
  },
];

export const bom = [
  {
    part: "ESP32-S3",
    role: "Edge MCU · on breadboard",
    bus: "I2C SDA 8 / SCL 9",
    note: "CSV @ 115200, ~100 Hz loop",
  },
  {
    part: "ADS1115",
    role: "ADC · on breadboard",
    bus: "I2C 0x48 AIN0",
    note: "16-bit, 0.125 mV/LSB · InGaAs TIA",
  },
  {
    part: "MAX30102",
    role: "PPG · off-board",
    bus: "I2C @ 400 kHz",
    note: "Red 660 nm + IR 880 nm, 18-bit ADC",
  },
  {
    part: "Dual NIR + InGaAs",
    role: "Optics · off-board",
    bus: "GPIO 5 / 6 + TIA → ADS",
    note: "Pulsed LEDs, dark-subtracted counts → mV",
  },
  {
    part: "HBT V2",
    role: "Heart-rate · off-board",
    bus: "Analog GPIO 7",
    note: "ADC counts, BPM, IBI from peak intervals",
  },
  {
    part: "DS18B20",
    role: "Skin temp · off-board",
    bus: "1-Wire GPIO 4",
    note: "±0.5 °C, optical compensation",
  },
];

export const pins = [
  { pin: "GPIO 8", sig: "SDA", to: "MAX30102 · ADS1115" },
  { pin: "GPIO 9", sig: "SCL", to: "I2C 400 kHz" },
  { pin: "GPIO 4", sig: "1-Wire", to: "DS18B20" },
  { pin: "GPIO 5", sig: "NIR LED 1", to: "MOSFET gate" },
  { pin: "GPIO 6", sig: "NIR LED 2", to: "MOSFET gate" },
  { pin: "GPIO 7", sig: "ADC", to: "HBT V2 analog" },
  { pin: "0x48 AIN0", sig: "TIA", to: "InGaAs detector" },
  { pin: "UART", sig: "115200", to: "CSV logger" },
];
