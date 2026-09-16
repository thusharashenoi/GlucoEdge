# GlucoEdge

Marketing site and research tooling for **GlucoEdge** — a finger-worn sensor that estimates blood glucose from infrared and thermal signatures, validated against a clinical fingerstick glucometer.

**Live site:** [https://glucoedge.vercel.app](https://glucoedge.vercel.app)

## Overview

GlucoEdge combines:

- **NIR + PPG optics** — dual near-infrared LEDs with an InGaAs photodiode, plus a MAX30102 for red/IR PPG
- **Thermal sensing** — DS18B20 skin temperature
- **On-device inference** — a lightweight model maps sensor features to glucose estimates
- **POC validation** — side-by-side comparison against fingerstick reference readings

This repository contains the public-facing website, Arduino firmware for the NIO-GM prototype, and a Python serial data collector.

## Tech stack

| Layer | Stack |
| --- | --- |
| Website | React 19, TypeScript, Vite 7, Tailwind CSS 4, Framer Motion |
| Firmware | ESP32-S3 (Arduino), MAX30102, ADS1115, DS18B20 |
| Tooling | Python 3, pyserial |

## Local development

### Prerequisites

- Node.js 18+
- npm

### Website

```bash
git clone https://github.com/thusharashenoi/GlucoEdge.git
cd GlucoEdge
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
npm run preview   # optional — serve the production build locally
```

Output is written to `dist/`.

### Firmware & data collection

```bash
# Flash firmware/nio_gm/nio_gm.ino to ESP32-S3 (Arduino IDE or PlatformIO)

pip install -r tools/requirements.txt
python3 tools/collect_nio_gm.py
# or specify port: python3 tools/collect_nio_gm.py --port /dev/cu.usbmodem1101
```

## Project structure

```
GlucoEdge/
├── src/                  # React app (Hero, Product, Architecture, Algorithm, POC)
├── public/               # Static assets (hero video, product stills)
├── firmware/nio_gm/      # ESP32-S3 firmware (CSV over serial @ 115200)
├── tools/                # Serial data collector for NIO-GM
├── index.html
├── vite.config.ts
└── package.json
```

## Vercel deployment

The site is deployed on [Vercel](https://vercel.com) under the project name **glucoedge**.

| | |
| --- | --- |
| **Production URL** | [https://glucoedge.vercel.app](https://glucoedge.vercel.app) |
| **GitHub repo** | [thusharashenoi/GlucoEdge](https://github.com/thusharashenoi/GlucoEdge) |
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **Install command** | `npm install` |
| **Framework preset** | Vite |

### Redeploy manually

From the project root:

```bash
npm run build
npx vercel deploy dist --prod --yes
```

The first run may prompt you to log in and link the project. Subsequent deploys update the production URL above.

### Deploy from GitHub (recommended)

For automatic deploys on every push to `main`:

1. Go to [vercel.com/new](https://vercel.com/new) and import **thusharashenoi/GlucoEdge**
2. Confirm the build settings match the table above (Vite, `npm run build`, output `dist`)
3. Deploy — Vercel will assign a production domain (e.g. `glucoedge.vercel.app`)

After linking, pushes to `main` trigger production deploys; pull requests get preview URLs.

## Disclaimer

Research prototype only. **Not a medical device.** Not for diagnosis or treatment. Glucose values shown on the site are illustrative POC comparisons against a fingerstick glucometer.

## License

Private research project. All rights reserved unless otherwise noted.
