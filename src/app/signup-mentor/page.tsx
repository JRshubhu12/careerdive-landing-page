import type { Metadata } from 'next';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { MentorSignupForm } from '@/components/landing/MentorSignupForm';
import { SectionWrapper } from '@/components/landing/SectionWrapper';

export const metadata: Metadata = {
  title: 'Mentor Signup - CareerDive',
  description: 'Become a mentor on CareerDive and share your expertise.',
};

export default function MentorSignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main className="flex-grow">
        <SectionWrapper className="py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Become a <span className="text-primary">Mentor</span>
              </h1>
              <p className="text-muted-foreground">
                Share your knowledge and experience to guide the next generation of professionals.
              </p>
            </div>
            <MentorSignupForm />
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
