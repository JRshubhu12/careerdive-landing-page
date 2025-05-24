import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';


interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating?: number;
}

export function TestimonialCard({ quote, name, role, avatarUrl, rating = 5 }: TestimonialCardProps) {
  return (
    <Card className="h-full shadow-lg bg-card flex flex-col">
      <CardContent className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {rating && (
            <div className="flex mb-2">
              {Array(rating).fill(0).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
              {Array(5 - rating).fill(0).map((_, i) => (
                 <Star key={i+rating} className="w-5 h-5 text-yellow-400/50" />
              ))}
            </div>
          )}
          <blockquote className="text-lg italic text-foreground mb-6">&ldquo;{quote}&rdquo;</blockquote>
        </div>
        <div className="flex items-center mt-auto">
          <Image
            src={avatarUrl}
            alt={name}
            width={48}
            height={48}
            className="rounded-full mr-4"
            data-ai-hint="professional headshot"
          />
          <div>
            <p className="font-semibold text-primary">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
