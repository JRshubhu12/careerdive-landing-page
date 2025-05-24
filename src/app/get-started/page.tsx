import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionWrapper } from '@/components/landing/SectionWrapper';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Get Started - CareerConnect',
  description: 'Choose your path on CareerConnect. Sign up as a mentor or mentee.',
};

export default function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main className="flex-grow">
        <SectionWrapper className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Choose <span className="text-primary">Your</span> Path
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the option that best describes your goals on CareerConnect.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
              <CardHeader className="items-center text-center pt-8">
                <div className="relative w-32 h-32 md:w-36 md:h-36 mb-4 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg">
                  <Image
                    src="https://placehold.co/200x200.png"
                    alt="Mentee"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="student learning"
                  />
                </div>
                <CardTitle className="text-2xl font-semibold">I&apos;m a Mentee</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-6 px-4">
                  Looking for guidance from industry professionals to accelerate my career growth.
                </p>
                <Button size="lg" className="w-full mt-auto" asChild>
                  <Link href="/signup?role=mentee">Sign Up as a Mentee</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
              <CardHeader className="items-center text-center pt-8">
                 <div className="relative w-32 h-32 md:w-36 md:h-36 mb-4 rounded-full overflow-hidden border-2 border-accent/50 shadow-lg">
                  <Image
                    src="https://placehold.co/200x200.png"
                    alt="Mentor"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="professional teaching"
                  />
                </div>
                <CardTitle className="text-2xl font-semibold">I&apos;m a Mentor</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-6 px-4">
                  Ready to share my expertise and guide individuals on their professional journey.
                </p>
                <Button size="lg" className="w-full mt-auto" variant="secondary" asChild>
                  <Link href="/signup?role=mentor">Sign Up as a Mentor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
