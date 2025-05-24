import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
}

export function FeatureCard({ icon: Icon, title, description, step }: FeatureCardProps) {
  return (
    <Card className="text-left h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card transform hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Step {step}</p>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
