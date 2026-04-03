import LogoLoop from './LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPostgresql } from 'react-icons/si';

const techLogos = [
  { node: <SiReact color='#4f46e5' />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs color='#1e0f35' />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript color='#4f46e5' />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss color='#1e0f35' />, title: "Tailwind CSS", href: "https://tailwindcss.com" },

  // Diverse options for broader reach
  { node: <SiNodedotjs color='#4f46e5' title="Node.js Backend" />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiPostgresql color='#1e0f35' title="PostgreSQL Database" />, title: "PostgreSQL", href: "https://postgresql.org" },
];

export function LogoSlider() {
  return (
    <section className="mt-12 py-10 bg-white" aria-labelledby="tech-stack-heading">
      <div className="max-w-7xl mx-auto px-4">
        {/* SEO-friendly Heading - Hidden visually if you want, but readable by bots */}
        <h2 id="tech-stack-heading" className="sr-only">
          My Technical Skills and Tech Stack
        </h2>
        
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
          Powering projects with modern technologies
        </p>

        <div className="relative overflow-hidden" style={{ height: '120px' }}>
          <LogoLoop
            logos={techLogos}
            speed={40} // Thoda slow rakhein taake user dekh sake
            direction="left"
            logoHeight={50}
            gap={80}
            hoverSpeed={10}
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
          />
        </div>

        {/* Hidden descriptive text for SEO ranking */}
        <div className="sr-only">
          Expertise in building scalable applications using React, Next.js, 
          TypeScript, Tailwind CSS, and modern backend solutions like Node.js.
        </div>
      </div>
    </section>
  );
}