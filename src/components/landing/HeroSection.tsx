
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from './SectionWrapper';
import Link from 'next/link';

export function HeroSection() {
  return (
    <SectionWrapper className="bg-[linear-gradient(90deg,_#000000,_#3533cd)] pt-24 md:pt-32 text-primary-foreground">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
            Unlock Your Potential with <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">CareerDive</span>: Connect with Experienced Mentors Today
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Find the guidance you need to achieve your career goals. Whether you&apos;re seeking advice or looking to share your expertise, CareerDive provides the perfect platform to connect mentors and mentees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild>
              <Link href="/get-started">Find a Mentor</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup-mentor">Become a Mentor</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
          <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Image
              src="https://i.ibb.co/hxcQM7kn/header.jpg"
              alt="Mentor and mentee collaborating"
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint="mentor meeting"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
      </div>
    </SectionWrapper>
  );
}
