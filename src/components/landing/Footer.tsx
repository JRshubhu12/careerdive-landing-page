import Link from 'next/link';
import { CareerConnectLogo } from '@/components/CareerConnectLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <CareerConnectLogo />
          <p className="text-sm text-muted-foreground mt-2">
            Connecting potential with experience.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
          <Link href="/terms-of-service" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact-us" className="hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t border-border/50">
        &copy; {currentYear} CareerConnect. All rights reserved.
      </div>
    </footer>
  );
}
