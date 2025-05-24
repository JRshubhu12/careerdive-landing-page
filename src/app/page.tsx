import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FinalCallToAction } from '@/components/landing/FinalCallToAction';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FinalCallToAction />
      </main>
      <Footer />
    </div>
  );
}
