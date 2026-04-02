import LogoLoop from './LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact color='#4f46e5' />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs color='#1e0f35' />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript color='#4f46e5' />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss color='#1e0f35' />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Alternative with image sources
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];

export function LogoSlider() {
  return (
    <div className="mt-3" style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
      {/* Basic horizontal loop */}
      <LogoLoop
        logos={techLogos}
        speed={100}
        direction="left"
        logoHeight={60}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
      
    </div>
  );
}