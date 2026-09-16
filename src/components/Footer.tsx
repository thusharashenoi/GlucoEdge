export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="text-[13px] font-semibold tracking-[0.28em]">GLUCOEDGE</div>
          <p className="mt-3 max-w-md text-sm text-mist">
            Research prototype. Not a medical device. Not for diagnosis or
            treatment. Product pages describe the envisioned ring. Prototype
            telemetry and glucose values on this site are illustrative.
          </p>
        </div>
        <div className="font-mono text-[11px] tracking-[0.18em] text-mist uppercase">
          Optical · Pulse · Thermal · Band
        </div>
      </div>
    </footer>
  );
}
