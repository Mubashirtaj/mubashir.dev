"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/reviews" },
];

const stackTags = ["React", "Next.js", "TypeScript"];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/yourusername",
    icon: (
      <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: (
      <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
        <path d="M0 1.8C0 .8.8 0 1.8 0H14.2C15.2 0 16 .8 16 1.8V14.2C16 15.2 15.2 16 14.2 16H1.8C.8 16 0 15.2 0 14.2V1.8zM4.8 13.4V6.2H2.4v7.2h2.4zm-1.2-8.2c.8 0 1.4-.6 1.4-1.4 0-.8-.6-1.4-1.4-1.4S2.2 3 2.2 3.8c0 .8.6 1.4 1.4 1.4zM13.4 13.4V9.4c0-2-1-3-2.6-3-.8 0-1.6.6-2 1.2V6.2H6.4v7.2h2.4V9.6c0-.8.6-1.4 1.4-1.4.8 0 1.2.6 1.2 1.4v3.8h2.4z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/yourusername",
    icon: (
      <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
        <path d="M12.6 1h2.4l-5.2 6 6.1 8H11l-3.8-5L2.9 15H.5l5.6-6.4L.2 1h5l3.4 4.5L12.6 1z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:you@email.com",
    icon: (
      <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
        <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-5.758 3.455L15 12.383V5.383zm-.034 7.628L8.995 9.04 8 9.598l-.995-.558-5.97 4.02A1 1 0 002 13h12a1 1 0 00.966-.989zM1 12.383l5.758-3.545L1 5.383v7z" />
      </svg>
    ),
  },
];

export default function PortfolioFooter() {
    const isAvailable = false; // Aapka availability state
  return (
    <footer className="relative overflow-hidden  px-6 pb-8 pt-14 md:px-12">
      {/* Top gradient border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.8) 30%, rgba(168,85,247,0.8) 70%, transparent 100%)",
        }}
      />

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-16 h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Main top row */}
        <div className="mb-12 flex flex-col items-start justify-between gap-10 md:flex-row md:items-start">
          {/* Left — Identity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-4xl font-medium tracking-tight text-[var(--primary-color)]">
              Mubashir
              <span
               
              >
                Taj
              </span>
            </h2>
            <p className="mb-6 max-w-[280px] text-sm leading-relaxed text-slate-500">
              Full-stack developer crafting clean interfaces and solid backends.
              Open to freelance &amp; full-time roles.
            </p>

            {/* Available badge */}
           {/* Maan lo aapka state 'isAvailable' hai */}
<div className={cn(
  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition-colors duration-300",
  isAvailable 
    ? "border-green-500/30 bg-green-500/7 text-green-300" 
    : "bg-amber-700 bg-amber-500/5 text-amber-700"
)}>
  <span className="relative flex h-1.5 w-1.5">
    {/* Ping Animation: Sirf tab dikhayenge jab available ho (optional) */}
    {isAvailable && (
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
    )}
    <span className={cn(
      "relative inline-flex h-1.5 w-1.5 rounded-full",
      isAvailable ? "bg-green-500" : "bg-amber-700"
    )} />
  </span>
  
  {isAvailable ? "Available for work" : "Currently busy"}
</div>
          </motion.div>

          {/* Right — Nav + Socials */}
          <motion.div
            className="flex flex-col items-start gap-6 md:items-end"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Nav pills */}
            <nav className="flex flex-wrap justify-end gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg border border-white/[0.06] px-3.5 py-1.5 text-[13px] text-[var(--primary-color)] transition-all duration-200 hover:border-indigo-500/35 hover:bg-indigo-500/8 hover:text-[var(--primary-color)]"
                > 
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-all duration-200 hover:border-indigo-500/45 hover:bg-indigo-500/10 hover:text-indigo-400"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider with code snippet */}
        <div className="mb-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[11px] text-slate-600">
            <span className="text-[var(--primary-color)]">const</span> year ={" "}
            <span className="text-[var(--secondary-color)]">
              {new Date().getFullYear()}
            </span>
            ;
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Comment-style copyright */}
          <p className="font-mono text-xs text-slate-600">
            
            <span className="text-[var(--secondary-color)]">Mubashirt Taj</span> · All rights
            reserved
          </p>

          {/* Stack tags */}
          <div className="flex items-center gap-1.5">
            {stackTags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 font-mono text-[11px] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Built with love */}
          <p className="flex items-center gap-1.5 text-xs text-slate-600">
            Built with{" "}
            <span className="text-fuchsia-400">♥</span>
            {" "}and too much coffee
          </p>
        </div>
      </div>
    </footer>
  );
}