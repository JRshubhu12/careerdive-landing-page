import { Button } from '@/components/ui/button';
import { SectionWrapper } from './SectionWrapper';
import Link from 'next/link';

export function FinalCallToAction() {
  return (
    <SectionWrapper className="text-center bg-gradient-to-b from-background to-secondary/20">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Ready to Take the Next Step?
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
        Join CareerDive today and start your journey towards career success.
        It&apos;s free to get started!
      </p>
      <Button size="lg" className="px-10 py-6 text-lg" asChild>
        <Link href="/get-started">Join CareerDive Now</Link>
      </Button>
    </SectionWrapper>
  );
}
