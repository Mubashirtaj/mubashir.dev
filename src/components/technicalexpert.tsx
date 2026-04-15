"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiNestjs,
  SiNextdotjs,
  SiReact,
  SiDocker,
  SiLinux,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const skills = [
  {
    title: "Languages",
    icon: "💬",
    gradient: "from-[#4FD1A5] to-[#285A48]",
    items: [
      { name: "TypeScript", desc: "Building scalable backend APIs with strict typing", icon: SiTypescript },
      { name: "JavaScript", desc: "Creating dynamic frontend applications", icon: SiJavascript },
      { name: "SQL", desc: "Designing optimized relational databases", icon: SiPostgresql },
    ],
  },
  {
    title: "Frameworks",
    icon: "⚛️",
    gradient: "from-[#4FD1A5] to-[#1a6b58]",
    items: [
      { name: "NestJS", desc: "Developing modular backend systems", icon: SiNestjs },
      { name: "Next.js", desc: "Building SEO-friendly full-stack apps", icon: SiNextdotjs },
      { name: "React", desc: "Crafting interactive UI components", icon: SiReact },
    ],
  },
  {
    title: "Infrastructure",
    icon: "☁️",
    gradient: "from-[#4FD1A5] to-[#0f4d3e]",
    items: [
      { name: "AWS", desc: "Deploying scalable cloud applications", icon: FaAws },
      { name: "Docker", desc: "Containerizing applications for consistency", icon: SiDocker },
      { name: "Linux (LVM)", desc: "Managing storage and server environments", icon: SiLinux },
    ],
  },
];

export default function TechnicalExpertise() {
  return (
    <section className="w-full py-24 px-6 relative overflow-hidden" style={{ background: "var(--gradient-bg)" }}>
      {/* Background animations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl bg-[#4FD1A5]/5" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl bg-[#4FD1A5]/5" animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#4FD1A5]/30 bg-[#4FD1A5]/10">
            <span className="text-sm font-mono text-[#4FD1A5]">&lt;expertise /&gt;</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-[var(--text-color)]">Technical Expertise</h2>
          <motion.div initial={{ width: 0 }} whileInView={{ width: "80px" }} className="h-1 bg-gradient-to-r from-[#4FD1A5] to-[#285A48] rounded-full mx-auto mb-6" />
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg">Technologies and tools I use to build scalable, high-performance applications.</p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 80, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className={`absolute  rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition duration-500`} />
              <div className="relative h-full rounded-2xl p-6 backdrop-blur-sm border border-[var(--border-color)] group-hover:border-transparent transition-all shadow-xl" style={{ background: "var(--card-bg)" }}>
                
                {/* Header */}
                <motion.div initial={{ rotate: -10, scale: 0 }} whileInView={{ rotate: 0, scale: 1 }} className="flex items-center gap-3 mb-6">
                  <motion.div animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }} className="text-3xl">{category.icon}</motion.div>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>{category.title}</h3>
                </motion.div>

                {/* Skills */}
                <div className="space-y-5">
                  {category.items.map((skill, i) => {
                    const Icon = skill.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 8 }}
                        className="group/skill relative rounded-xl p-3 transition-all hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <motion.div whileHover={{ scale: 1.2, rotate: [0, -10, 10, -5, 5, 0] }} transition={{ type: "spring", stiffness: 400 }} className="flex-shrink-0 mt-0.5">
                            <Icon className="w-7 h-7 text-[#4FD1A5]" />
                          </motion.div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg text-[var(--text-color)]">{skill.name}</p>
                            <p className="text-sm text-[var(--text-muted)] group-hover/skill:text-[var(--text-color)] transition-colors">{skill.desc}</p>
                            <motion.div initial={{ width: "0%" }} whileHover={{ width: "100%" }} className={`h-[2px] bg-gradient-to-r ${category.gradient} rounded-full mt-2`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} rounded-b-2xl origin-left`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating icons */}
        <div className="absolute bottom-10 left-10 pointer-events-none">
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="text-4xl opacity-20 text-[#4FD1A5]">⚡</motion.div>
        </div>
        <div className="absolute top-20 right-10 pointer-events-none">
          <motion.div animate={{ y: [0, 10, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="text-3xl opacity-20 text-[#4FD1A5]">💻</motion.div>
        </div>
      </div>
    </section>
  );
}