import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { Navbar } from "@/components/landing/navbar";
import { PainSection } from "@/components/landing/pain-section";
import { PricingSection } from "@/components/landing/pricing-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-black overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PainSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}