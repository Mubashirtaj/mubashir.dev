"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";
import { Particles } from "./ui/particles2";

export function BentoGridSecondDemo() {
  return (
    <div className="relative min-h-screen overflow-hidden ">

      {/* PARTICLES BACKGROUND */}
      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={800}
        ease={80}
        color={"text-[var(--primary-color)]"}
        refresh
      />

      {/* CONTENT */}
      <div className="relative z-10 py-10">

        <BentoGrid className="max-w-6xl mx-auto gap-4 md:auto-rows-auto">

          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
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
    title: "The Dawn of Innovation",
    description:
      "Explore the birth of groundbreaking ideas and inventions.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/Gemini_Generated_Image_qbqk0qbqk0qbqk0q.png"
        alt="Innovation"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-2",
    icon: <IconClipboardCopy className="h-5 w-5 text-[var(--primary-color)]" />,
  },

  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/Gemini_Generated_Image_qbqk0qbqk0qbqk0q.png"
        alt="Digital"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-5 w-5 text-[var(--primary-color)]" />,
  },

  {
    title: "The Art of Design",
    description:
      "Discover the beauty of thoughtful and functional design.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/Gemini_Generated_Image_qbqk0qbqk0qbqk0q.png"
        alt="Design"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-1",
    icon: <IconSignature className="h-5 w-5 text-[var(--primary-color)]" />,
  },

  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    header: (
      <Image
        src="https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/Gemini_Generated_Image_qbqk0qbqk0qbqk0q.png"
        alt="Communication"
        width={800}
        height={500}
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-5 w-5 text-[var(--primary-color)]" />,
  },
];