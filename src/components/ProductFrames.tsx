export function RingVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`ring-stage relative h-[320px] w-full overflow-hidden md:h-[400px] ${className}`}>
      <img
        src="/stills/ring-finger.png?v=5"
        alt="Thick GlucoEdge sensing ring on a finger"
        className="absolute inset-0 h-full w-full object-cover object-[center_58%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-ink/20" />
    </div>
  );
}

export function HudVisual({
  band,
  mgdl,
  className = "",
}: {
  band: string;
  mgdl: number;
  className?: string;
}) {
  return (
    <div className={`hud-stage relative h-[320px] w-full overflow-hidden md:h-[400px] ${className}`}>
      <div className="absolute inset-0 scanline opacity-25" />
      <svg viewBox="0 0 640 720" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect x="90" y="110" width="460" height="500" rx="48" fill="#0a1016" stroke="rgba(126,231,255,0.25)" />
        <rect x="118" y="148" width="404" height="424" rx="32" fill="#05080c" />
        <circle cx="320" cy="340" r="118" fill="none" stroke="rgba(61,255,138,0.18)" strokeWidth="18" />
        <circle cx="320" cy="340" r="118" fill="none" stroke="#3dff8a" strokeWidth="6" strokeDasharray="520 220" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pb-8">
        <p className="font-mono text-[10px] tracking-[0.35em] text-mist uppercase">Live estimate</p>
        <p className="mt-3 text-6xl font-light text-led glow-led">{mgdl}</p>
        <p className="mt-1 font-mono text-xs tracking-[0.2em] text-mist uppercase">mg/dL</p>
        <p className="mt-6 rounded-full border border-led/40 bg-led/10 px-4 py-1.5 font-mono text-[11px] tracking-[0.22em] text-led uppercase">
          {band}
        </p>
      </div>
    </div>
  );
}

export function ExplodedVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`exploded-stage relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 grid-fade opacity-50" />
      <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <ellipse cx="18" cy="30" rx="8" ry="11" fill="none" stroke="#8b949e" strokeWidth="0.35" />
        <rect x="28" y="24" width="10" height="12" rx="1.5" fill="none" stroke="#3dff8a" strokeWidth="0.3" />
        <rect x="42" y="22" width="12" height="14" rx="1.2" fill="none" stroke="#7ee7ff" strokeWidth="0.3" />
        <rect x="58" y="24" width="8" height="11" rx="1.4" fill="none" stroke="#c4a574" strokeWidth="0.3" />
        <rect x="70" y="26" width="7" height="8" rx="1" fill="none" stroke="#3dff8a" strokeWidth="0.28" />
        <ellipse cx="86" cy="30" rx="7" ry="10" fill="none" stroke="#8b949e" strokeWidth="0.35" />
        <line x1="11" y1="30" x2="92" y2="30" stroke="rgba(61,255,138,0.28)" strokeWidth="0.12" strokeDasharray="1 0.8" />
      </svg>
    </div>
  );
}

export function PcbVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`pcb-stage relative h-64 w-full overflow-hidden md:h-80 ${className}`}>
      <svg viewBox="0 0 860 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <pattern id="bbHoles" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.15" fill="#1a120c" opacity="0.35" />
          </pattern>
        </defs>

        <text x="36" y="28" fill="#9aa3ad" fontSize="11" fontFamily="IBM Plex Mono" letterSpacing="2.4">
          NIO-GM BENCH · BREADBOARD + OFF-BOARD SENSORS
        </text>

        {/* Breadboard */}
        <rect x="36" y="44" width="360" height="168" rx="10" fill="#d7c4a3" />
        <rect x="36" y="44" width="360" height="168" rx="10" fill="url(#bbHoles)" />
        <rect x="36" y="44" width="360" height="14" rx="4" fill="#9b2c2c" opacity="0.85" />
        <rect x="36" y="198" width="360" height="14" rx="4" fill="#1d4e89" opacity="0.85" />
        <text x="48" y="72" fill="#3a2a1c" fontSize="10" fontFamily="IBM Plex Mono">
          BREADBOARD
        </text>

        <rect x="56" y="88" width="168" height="86" rx="8" fill="#0d141c" stroke="#7ee7ff" strokeWidth="1.6" />
        <text x="76" y="124" fill="#7ee7ff" fontSize="16" fontFamily="IBM Plex Mono">ESP32-S3</text>
        <text x="76" y="146" fill="#9aa3ad" fontSize="10" fontFamily="IBM Plex Mono">MCU on-board</text>

        <rect x="240" y="96" width="132" height="70" rx="8" fill="#0d141c" stroke="#c4a574" strokeWidth="1.6" />
        <text x="258" y="128" fill="#c4a574" fontSize="15" fontFamily="IBM Plex Mono">ADS1115</text>
        <text x="258" y="148" fill="#9aa3ad" fontSize="10" fontFamily="IBM Plex Mono">I2C 0x48</text>

        <text x="48" y="232" fill="#9aa3ad" fontSize="11" fontFamily="IBM Plex Mono">
          Only ESP32-S3 + ADS1115 sit on the breadboard
        </text>

        {/* Jumpers out */}
        <path d="M140 174 L140 248" fill="none" stroke="#3dff8a" strokeWidth="2" />
        <path d="M306 166 L306 248" fill="none" stroke="#c4a574" strokeWidth="2" />
        <path d="M140 248 L430 248" fill="none" stroke="#3dff8a" strokeWidth="2" />
        <path d="M306 248 L520 248" fill="none" stroke="#c4a574" strokeWidth="2" />
        <circle cx="140" cy="174" r="3.5" fill="#3dff8a" />
        <circle cx="306" cy="166" r="3.5" fill="#c4a574" />

        {/* Off-board modules */}
        <text x="430" y="72" fill="#9aa3ad" fontSize="10" fontFamily="IBM Plex Mono">
          OFF-BOARD
        </text>

        <rect x="430" y="84" width="88" height="56" rx="8" fill="#121820" stroke="#3dff8a" strokeOpacity="0.7" />
        <text x="442" y="108" fill="#3dff8a" fontSize="11" fontFamily="IBM Plex Mono">MAX30102</text>
        <text x="442" y="124" fill="#9aa3ad" fontSize="9" fontFamily="IBM Plex Mono">I2C PPG</text>

        <rect x="530" y="84" width="100" height="56" rx="8" fill="#121820" stroke="#c4a574" strokeOpacity="0.7" />
        <text x="542" y="108" fill="#c4a574" fontSize="11" fontFamily="IBM Plex Mono">NIR + PD</text>
        <text x="542" y="124" fill="#9aa3ad" fontSize="9" fontFamily="IBM Plex Mono">to ADS AIN0</text>

        <rect x="644" y="84" width="80" height="56" rx="8" fill="#121820" stroke="#7ee7ff" strokeOpacity="0.7" />
        <text x="656" y="108" fill="#7ee7ff" fontSize="11" fontFamily="IBM Plex Mono">HBT V2</text>
        <text x="656" y="124" fill="#9aa3ad" fontSize="9" fontFamily="IBM Plex Mono">GPIO 7</text>

        <rect x="736" y="84" width="88" height="56" rx="8" fill="#121820" stroke="#3dff8a" strokeOpacity="0.65" />
        <text x="748" y="108" fill="#3dff8a" fontSize="11" fontFamily="IBM Plex Mono">DS18B20</text>
        <text x="748" y="124" fill="#9aa3ad" fontSize="9" fontFamily="IBM Plex Mono">GPIO 4</text>

        <path d="M474 140 L474 248 L140 248" fill="none" stroke="rgba(61,255,138,0.45)" strokeWidth="1.5" />
        <path d="M580 140 L580 248 L306 248" fill="none" stroke="rgba(196,165,116,0.7)" strokeWidth="1.5" />
        <path d="M684 140 L684 268 L140 268" fill="none" stroke="rgba(126,231,255,0.45)" strokeWidth="1.5" />
        <path d="M780 140 L780 288 L140 288" fill="none" stroke="rgba(61,255,138,0.35)" strokeWidth="1.5" />

        <text x="430" y="320" fill="#9aa3ad" fontSize="11" fontFamily="IBM Plex Mono">
          Jumpers · I2C / analog / 1-Wire / MOSFET gates
        </text>
      </svg>
    </div>
  );
}
