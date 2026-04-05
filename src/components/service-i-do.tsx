"use client"
import React, { useEffect, useRef } from 'react'
import { Particles } from './ui/particles2'

const services = [
  {
    title: 'Frontend development',
    desc: 'React, Next.js, Tailwind — responsive UIs with smooth animations and great DX.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    title: 'Backend development',
    desc: 'REST & GraphQL APIs, Node.js, Python, databases — scalable and secure by design.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <path d="M5 12H3l9-9 9 9h-2"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/><path d="M9 21v-6h6v6"/>
      </svg>
    ),
  },
  {
    title: 'Deployment & CI/CD',
    desc: 'GitHub Actions, Docker, Kubernetes — zero-downtime pipelines from dev to prod.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: 'Cloud computing',
    desc: 'AWS, GCP — architecting reliable, cost-efficient infrastructure at any scale.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
  },
  {
    title: 'Linux administration',
    desc: 'Server hardening, systemd, cron, nginx — full server ownership from setup to monitoring.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M22 10H2M6 14h.01M10 14h.01"/>
      </svg>
    ),
  },
  {
    title: 'Product testing',
    desc: 'Unit, integration, and E2E testing — Vitest, Playwright, Cypress.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    title: 'Scalable systems',
    desc: 'Microservices, queues, caching — designing for high load before it becomes a problem.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
      </svg>
    ),
  },
  {
    title: 'Business adviser',
    desc: 'Tech strategy, website ROI, stack choices — bridging business goals and code.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      </svg>
    ),
  },
]

export const ServiceIDo = () => {
  return (
    <section className="relative overflow-hidden  py-16">


      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#6366f1] bg-[#4f46e5]/10 border border-[#6366f1]/30 rounded-full px-4 py-1 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse" />
            Available for work
          </span>
          <h2 className="text-4xl font-semibold text-[var(--primary-color)] mb-3">What I do</h2>
          <p className="text-[#9893b8] text-base max-w-md mx-auto leading-relaxed">
            End-to-end engineering — from cloud infrastructure to pixel-perfect interfaces.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-[#6366f1]/25 bg-[#4f46e5]/[0.07] p-5 overflow-hidden
                         hover:bg-[#4f46e5]/[0.14] hover:border-[#6366f1] hover:-translate-y-1
                         transition-all duration-200"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* subtle inner glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_65%)]" />

              <div className="w-10 h-10 rounded-xl bg-[#4f46e5]/20 flex items-center justify-center mb-4
                              animate-[float_3.5s_ease-in-out_infinite]">
                {s.icon}
              </div>
              <p className="text-black font-medium text-sm mb-1.5">{s.title}</p>
              <p className="text-[#5e5e61] text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
            <Particles
        className="absolute inset-0 z-0"
        quantity={1000}
        ease={80}
        color="#4f46e5"
        refresh
      />
    </section>
  )
}