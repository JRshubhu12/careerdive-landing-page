
"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FinalCallToAction } from '@/components/landing/FinalCallToAction';
import { Footer } from '@/components/landing/Footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mentorEmail = localStorage.getItem('careerDiveMentorEmail');
      if (mentorEmail) {
        // Redirect to mentor dashboard
        window.location.href = 'https://mentor-dashboard.netlify.app/auth';
        // Keep isLoading true if redirecting to avoid rendering the page
        return;
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground antialiased items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

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

    