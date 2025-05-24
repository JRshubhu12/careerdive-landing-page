import { SectionWrapper } from './SectionWrapper';
import { FeatureCard } from './FeatureCard';
import { UserPlus, UsersRound, MessageCircle, Target } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free profile and tell us about your goals or expertise.",
  },
  {
    icon: UsersRound,
    title: "Get Matched",
    description: "Our smart algorithm connects you with the perfect mentor or mentee.",
  },
  {
    icon: MessageCircle,
    title: "Connect & Learn",
    description: "Start building your relationship through our platform's messaging and video call features.",
  },
  {
    icon: Target,
    title: "Achieve Your Goals",
    description: "Track your progress and celebrate your successes together.",
  },
];

export function HowItWorksSection() {
  return (
    <SectionWrapper id="how-it-works" className="bg-secondary/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How CareerDive Works</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A simple and effective process to kickstart your mentorship journey.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <FeatureCard
            key={step.title}
            icon={step.icon}
            title={step.title}
            description={step.description}
            step={index + 1}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
