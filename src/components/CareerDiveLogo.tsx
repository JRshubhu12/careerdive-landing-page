import React from 'react';
import { cn } from '@/lib/utils';

export function CareerDiveLogo({ className }: { className?: string }) {
  return (
    <div className={cn('font-bold text-2xl tracking-tight', className)}>
      <span className="text-primary">Career</span>
      <span className="text-accent">Dive</span>
    </div>
  );
}
