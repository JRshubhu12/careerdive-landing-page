import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PricingCardProps {
  tierName: string;
  price: string;
  priceFrequency?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isHighlighted?: boolean;
}

export function PricingCard({
  tierName,
  price,
  priceFrequency = "/month",
  description,
  features,
  ctaText,
  ctaLink,
  isHighlighted = false,
}: PricingCardProps) {
  return (
    <Card className={cn(
      "flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300",
      isHighlighted ? "border-primary border-2 relative ring-2 ring-primary/50" : "bg-card"
    )}>
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-md">
          Best Value
        </div>
      )}
      <CardHeader className="pt-8">
        <CardTitle className="text-2xl font-bold text-center text-primary">{tierName}</CardTitle>
        <CardDescription className="text-center text-muted-foreground h-12">{description}</CardDescription>
        <div className="text-center my-4">
          <span className="text-4xl font-extrabold text-foreground">{price}</span>
          { price !== "Custom" && price !== "Free" && <span className="text-muted-foreground">{priceFrequency}</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button size="lg" className="w-full" variant={isHighlighted ? "default" : "outline"} asChild>
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
