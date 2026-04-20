import type { Metadata } from "next";
import AboutBanner from '@/components/about-banner'
import CoreExpertise from '@/components/CoreExpertise-about'
import FeaturedProjects from '@/components/FeaturedProjects-about'

export const metadata: Metadata = {
  title: "About | Pakistan Full Stack Developer – NestJS, React & AWS",
  description:
    "Mubashir Taj is a Pakistan-based full stack developer specializing in scalable systems with NestJS, React, and AWS. Learn about his expertise, projects, and approach to building production-ready applications.",
  keywords: [
    "Pakistan web developer",
    "full stack developer Pakistan",
    "NestJS developer",
    "React developer Pakistan",
    "AWS developer Pakistan",
    "scalable web applications",
    "backend developer Pakistan",
    "Node.js developer",
    "cloud architecture AWS",
    "software engineer Pakistan",
  ],
  authors: [{ name: "Mubashir Taj" }],
  openGraph: {
    title: "About | Pakistan Full Stack Developer – NestJS, React & AWS",
    description:
      "Pakistan-based full stack developer building scalable systems with NestJS, React, and AWS. Explore my expertise and featured projects.",
    url: "https://mubashirtaj.dev/about",
    siteName: "Mubashir Taj | Portfolio",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Pakistan Full Stack Developer – NestJS, React & AWS",
    description:
      "Pakistan-based full stack developer building scalable systems with NestJS, React, and AWS.",
  },
  alternates: {
    canonical: "https://mubashirtaj.dev/about",
  },
};

const page = () => {
  return (
    <div>
      <AboutBanner />
      <CoreExpertise />
      <FeaturedProjects />
    </div>
  );
};

export default page;