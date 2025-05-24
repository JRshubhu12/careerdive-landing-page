
"use client";

import Link from 'next/link';
import { CareerDiveLogo } from '@/components/CareerDiveLogo';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Header() {
  const [isMentor, setIsMentor] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To manage initial check

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mentorEmail = localStorage.getItem('careerDiveMentorEmail');
      if (mentorEmail) {
        setIsMentor(true);
      }
    }
    setIsLoading(false);
  }, []);

  const getStartedLink = isMentor ? "https://mentor-dashboard.netlify.app/auth" : "/get-started";
  const getStartedText = isMentor ? "Login to your Dashboard" : "Get Started";

  return (
    <header className="py-4 px-4 md:px-6 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" aria-label="CareerDive Home">
          <CareerDiveLogo />
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/#how-it-works">How it Works</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#testimonials">Testimonials</Link>
          </Button>
          {!isLoading && (
            <Button asChild className="ml-4">
              <Link href={getStartedLink} target={isMentor ? "_blank" : "_self"} rel={isMentor ? "noopener noreferrer" : ""}>{getStartedText}</Link>
            </Button>
          )}
        </nav>
        <div className="md:hidden">
         {!isLoading && (
            <Button asChild>
               <Link href={getStartedLink} target={isMentor ? "_blank" : "_self"} rel={isMentor ? "noopener noreferrer" : ""}>{getStartedText}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

    