import { motion } from "framer-motion";

const links = [
  { href: "#architecture", label: "Architecture" },
  { href: "#model", label: "Model" },
  { href: "#poc", label: "POC" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="relative grid h-8 w-8 place-items-center">
            <span className="absolute inset-0 rounded-full border border-led/70" />
            <span className="h-2 w-2 rounded-full bg-led shadow-[0_0_12px_#3dff8a]" />
          </span>
          <span className="text-[13px] font-semibold tracking-[0.28em]">
            GLUCOEDGE
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-[12px] tracking-[0.22em] text-mist uppercase md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-led"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#poc"
          className="rounded-full border border-led/40 bg-led/10 px-4 py-1.5 text-[11px] tracking-[0.2em] text-led uppercase"
        >
          Prototype
        </a>
      </div>
    </motion.header>
  );
}
