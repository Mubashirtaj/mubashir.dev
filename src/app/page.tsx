import { BentoGridSecondDemo } from "@/components/featured-project";
import PortfolioFooter from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import BlogSection from "@/components/latest-blogs";
import { LogoSlider } from "@/components/logo-slider";
import { ServiceIDo } from "@/components/service-i-do";
import GoogleReviewsSection from "@/components/testimonials";


export default function Home() {
  return (
   <>
   <HeroSection />
   <LogoSlider />
   <BentoGridSecondDemo />
   <BlogSection />
   <ServiceIDo />
   <GoogleReviewsSection />
   
   </>
  );
}
