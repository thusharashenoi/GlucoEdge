import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const SECTIONS = ["top", "product", "architecture", "model", "poc"] as const;

function sectionY(id: string) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY;
}

function activeIndex() {
  const probe = window.scrollY + window.innerHeight * 0.28;
  let idx = 0;
  for (let i = 0; i < SECTIONS.length; i += 1) {
    if (sectionY(SECTIONS[i]) <= probe + 8) idx = i;
  }
  return idx;
}

function goTo(index: number) {
  const next = Math.max(0, Math.min(SECTIONS.length - 1, index));
  const el = document.getElementById(SECTIONS[next]);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SectionNav() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const sync = () => setIndex(activeIndex());
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goTo(activeIndex() + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goTo(activeIndex() - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const atStart = index <= 0;
  const atEnd = index >= SECTIONS.length - 1;

  return (
    <div className="pointer-events-none fixed right-4 bottom-6 z-[60] flex flex-col items-center gap-2 md:right-6">
      <p className="pointer-events-none hidden font-mono text-[9px] tracking-[0.28em] text-mist uppercase md:block">
        ↑ ↓
      </p>
      <div className="pointer-events-auto flex flex-col overflow-hidden rounded-full border border-white/12 bg-ink/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <button
          type="button"
          aria-label="Previous section"
          disabled={atStart}
          onClick={() => goTo(index - 1)}
          className="grid h-11 w-11 place-items-center text-led transition-colors hover:bg-led/10 disabled:text-white/20 disabled:hover:bg-transparent"
        >
          <ChevronUp size={18} />
        </button>
        <div className="h-px bg-white/10" />
        <button
          type="button"
          aria-label="Next section"
          disabled={atEnd}
          onClick={() => goTo(index + 1)}
          className="grid h-11 w-11 place-items-center text-led transition-colors hover:bg-led/10 disabled:text-white/20 disabled:hover:bg-transparent"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
