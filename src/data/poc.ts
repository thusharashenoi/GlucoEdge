export type PocSample = {
  id: number;
  time: string;
  ir: number;
  red: number;
  temp: number;
  ref: number;
  pred: number;
};

export const pocSamples: PocSample[] = [
  { id: 1, time: "07:42", ir: 112840, red: 54820, temp: 32.8, ref: 78, pred: 91 },
  { id: 2, time: "08:05", ir: 109210, red: 53110, temp: 33.0, ref: 82, pred: 71 },
  { id: 3, time: "08:31", ir: 104560, red: 51940, temp: 33.1, ref: 88, pred: 102 },
  { id: 4, time: "09:10", ir: 98640, red: 50210, temp: 33.4, ref: 96, pred: 84 },
  { id: 5, time: "09:48", ir: 94120, red: 48900, temp: 33.6, ref: 104, pred: 118 },
  { id: 6, time: "10:22", ir: 91280, red: 47650, temp: 33.7, ref: 112, pred: 97 },
  { id: 7, time: "11:05", ir: 87410, red: 46120, temp: 33.9, ref: 121, pred: 148 },
  { id: 8, time: "11:40", ir: 85900, red: 45280, temp: 34.1, ref: 126, pred: 109 },
  { id: 9, time: "12:18", ir: 80110, red: 43840, temp: 34.4, ref: 142, pred: 176 },
  { id: 10, time: "12:55", ir: 77840, red: 42910, temp: 34.5, ref: 151, pred: 133 },
  { id: 11, time: "13:30", ir: 81220, red: 44100, temp: 34.3, ref: 138, pred: 154 },
  { id: 12, time: "14:12", ir: 84670, red: 45320, temp: 34.0, ref: 129, pred: 118 },
  { id: 13, time: "14:50", ir: 88910, red: 46880, temp: 33.8, ref: 117, pred: 101 },
  { id: 14, time: "15:28", ir: 92340, red: 48110, temp: 33.6, ref: 108, pred: 132 },
  { id: 15, time: "16:05", ir: 96110, red: 49540, temp: 33.5, ref: 99, pred: 86 },
  { id: 16, time: "16:42", ir: 100280, red: 50880, temp: 33.3, ref: 91, pred: 108 },
  { id: 17, time: "17:20", ir: 103450, red: 52100, temp: 33.2, ref: 85, pred: 74 },
  { id: 18, time: "18:05", ir: 88770, red: 46420, temp: 34.0, ref: 118, pred: 139 },
  { id: 19, time: "18:48", ir: 75420, red: 41880, temp: 34.6, ref: 158, pred: 122 },
  { id: 20, time: "19:22", ir: 72110, red: 40940, temp: 34.8, ref: 167, pred: 205 },
  { id: 21, time: "20:10", ir: 76880, red: 42200, temp: 34.5, ref: 154, pred: 138 },
  { id: 22, time: "20:55", ir: 83440, red: 44780, temp: 34.2, ref: 132, pred: 151 },
  { id: 23, time: "21:30", ir: 90560, red: 47210, temp: 33.9, ref: 113, pred: 95 },
  { id: 24, time: "22:08", ir: 97220, red: 49980, temp: 33.4, ref: 97, pred: 114 },
];

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
const zoneB = n - zoneA;

export const modelMetrics = {
  n,
  mae: Number(mae.toFixed(1)),
  rmse: Number(rmse.toFixed(1)),
  r: Number(r.toFixed(2)),
  zoneAPct: Number(((zoneA / n) * 100).toFixed(0)),
  zoneBPct: Number(((zoneB / n) * 100).toFixed(0)),
  subjects: 4,
  windowSec: 10,
};

export const featureImportance = [
  { name: "IR AC / DC", value: 38, note: "880 nm PPG" },
  { name: "Skin temperature", value: 24, note: "DS18B20" },
  { name: "IR / Red ratio", value: 19, note: "tissue compensation" },
  { name: "Red AC / DC", value: 12, note: "660 nm PPG" },
  { name: "Pulse amplitude", value: 7, note: "perfusion" },
];

export const pipeline = [
  {
    step: "01",
    title: "Contact lock",
    body: "IR intensity gates a valid finger presence. Readings below the optical floor are discarded as air or motion.",
  },
  {
    step: "02",
    title: "PPG window",
    body: "A 10-second dual-wavelength capture from the MAX30102 at IR 880 nm and Red 660 nm, streamed at ~25–100 Hz.",
  },
  {
    step: "03",
    title: "Signal split",
    body: "Bandpass isolation of pulsatile AC versus tissue DC. Motion spikes are clipped before feature assembly.",
  },
  {
    step: "04",
    title: "Thermal correction",
    body: "Skin temperature from the DS18B20 rescales optical path length and LED efficiency so heat is not mistaken for glucose.",
  },
  {
    step: "05",
    title: "Boosted regressor",
    body: "A gradient-boosted model maps the compensated feature vector to mg/dL, trained against paired fingerstick labels.",
  },
  {
    step: "06",
    title: "Reference check",
    body: "Every training and eval sample is paired with a clinical glucometer reading taken within the same minute.",
  },
];

export const bom = [
  {
    part: "ESP32-S3",
    role: "Edge MCU",
    bus: "I2C SDA 8 / SCL 9",
    note: "115200 baud serial logger",
  },
  {
    part: "MAX30102",
    role: "PPG optical front-end",
    bus: "I2C @ 400 kHz",
    note: "IR 880 nm + Red 660 nm, 18-bit ADC",
  },
  {
    part: "DS18B20",
    role: "Skin temperature",
    bus: "1-Wire GPIO 4",
    note: "±0.5 °C, used for optical compensation",
  },
  {
    part: "SSD1306 OLED",
    role: "On-device HUD",
    bus: "I2C 0x3C",
    note: "128 × 64, live IR / Red / Temp",
  },
];
