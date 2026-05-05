"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconBroadcast,
  IconClipboardCopy,
  IconFileBroken,
  IconRocket,
  IconShieldCheck,
  IconSignature,
  IconTableColumn,
  IconTruckDelivery,
} from "@tabler/icons-react";
import Image from "next/image";
import { Particles } from "./ui/particles2";
import { hr } from "date-fns/locale";

export function BentoGridSecondDemo() {
  return (
    <div className="relative min-h-screen overflow-hidden ">
      {/* PARTICLES BACKGROUND */}
      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={100}
        ease={80}
        color={"text-[var(--primary-color)]"}
        refresh
      />

      {/* CONTENT */}
      <div className="relative z-10 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Featured Projects</h2>

        <BentoGrid className="max-w-6xl mx-auto gap-4 md:auto-rows-auto">

          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              href={item.href}
              className={cn(
                "p-4 rounded-2xl border border-white/10",
                "bg-[var(--secondary-color)]/20 backdrop-blur-md",
                "text-[var(--text-color)]",
                "hover:bg-[var(--primary-hover)]/20 hover:scale-[1.02]",
                "transition-all duration-300",
                item.className
              )}
            />
          ))}

        </BentoGrid>

      </div>
    </div>
  );
}

/* -------------------- ITEMS -------------------- */

const items = [
  {
    title: "AI-Powered Compliance LMS",
    description:
      "A TSLR-approved defensive driving platform featuring AI face verification, automated proctoring, and high-security certification logic.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/lms-project-image.webp"
        alt="Secure LMS with Face Detection"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-2",
    icon: <IconShieldCheck className="h-5 w-5 text-[var(--primary-color)]" />,
    href: "/blog/tdlr-approved-defensive-driving-lms-ai-face-verification",
  },

  {
    title: "Real-Time Engineering",
    description: "Architecting low-latency systems: From P2P WebRTC streaming to high-frequency trading dashboards with 5+ years of expertise.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/realtime-banner-image.webp"
        alt="Real-time Application Development"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-1",
    icon: <IconBroadcast className="h-5 w-5 text-[var(--primary-color)]" />,
     href: "/blog/mastering-the-real-time-web-scalable-websockets-webrtc-solutions",
  },

  {
    title: "Logistics & Port Clearance ERP",
    description:
      "A multi-tenant, enterprise-grade system featuring database partitioning and automated job tracking for large-scale port operations.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/logistic-banner-image.webp"
        alt="Logistics ERP System"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-1",
    icon: <IconTruckDelivery className="h-5 w-5 text-[var(--primary-color)]" />,
     href: "/blog/multi-tenant-logistics-port-clearance-system",
   
  },

  {
    title: "Full-Scale SaaS Engineering",
    description:
      "Crafting end-to-end SaaS solutions from concept to production. Specialized in multi-tenant architectures, integrated billing, and high-performance cloud systems.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/multiple-saas-image.webp"
        alt="SaaS Portfolio Showcase"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-2",
    icon: <IconRocket className="h-5 w-5 text-[var(--primary-color)]" />,
     href: "/blog/full-stack-saas-product-engineering",

  },
];