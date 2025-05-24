import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from './SectionWrapper';
import Link from 'next/link';

export function HeroSection() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-background to-secondary/30 pt-24 md:pt-32">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
            Unlock Your Potential with <span className="text-primary">CareerConnect</span>: Connect with Experienced Mentors Today
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Find the guidance you need to achieve your career goals. Whether you&apos;re seeking advice or looking to share your expertise, CareerConnect provides the perfect platform to connect mentors and mentees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild>
              <Link href="/find-mentor">Find a Mentor</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/become-mentor">Become a Mentor</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="https://placehold.co/1200x675.png"
            alt="Mentor and mentee collaborating"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="mentorship team collaboration"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </SectionWrapper>
  );
}
