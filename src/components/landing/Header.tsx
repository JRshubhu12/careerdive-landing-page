import Link from 'next/link';
import { CareerConnectLogo } from '@/components/CareerConnectLogo';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" aria-label="CareerConnect Home">
          <CareerConnectLogo />
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="#how-it-works">How it Works</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#testimonials">Testimonials</Link>
          </Button>
          {/* <Button variant="outline" asChild className="ml-4">
            <Link href="/login">Sign In</Link>
          </Button> */}
          <Button asChild className="ml-4">
            <Link href="/get-started">Get Started</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          {/* Mobile menu can be added here if needed */}
          <Button asChild>
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
