"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { Particles } from "./ui/particles2";

export function BentoGridSecondDemo() {
  return (
    <div className="relative overflow-hidden">
<Particles
            className="absolute inset-0 z-0"
            quantity={1000}
            ease={80}
            color={'#4f46e5'}
            refresh
          />
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn(
            "p-4 rounded-xl border border-transparent transition-colors",
            "bg-var(--secondary-color) text-var(--text-color) hover:bg-var(--primary-hover)",
            item.className
          )}
          icon={item.icon}
          />
      ))}
    </BentoGrid>
          </div>
  );
}

const Skeleton = () => (
  <div
    className={cn(
      "flex flex-1 w-full h-full min-h-[6rem] rounded-xl border border-transparent",
      "bg-[var(--bg-color)] dark:bg-black",
      "[mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
    )}
  >

    
  </div>
);

const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    className: "md:col-span-2",
    icon: <IconClipboardCopy className="h-4 w-4 text-[var(--primary-color)]" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-[var(--primary-color)]" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-[var(--primary-color)]" />,
  },
  {
    title: "The Power of Communication",
    description: "Understand the impact of effective communication in our lives.",
    header: <Skeleton />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-[var(--primary-color)]" />,
  },
];
