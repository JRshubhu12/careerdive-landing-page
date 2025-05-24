import { SectionWrapper } from './SectionWrapper';
import { PricingCard } from './PricingCard';

const pricingTiers = [
  {
    tierName: "Basic",
    price: "Free",
    description: "Get started with essential mentorship features.",
    features: [
      "Access to mentor/mentee profiles",
      "Limited messaging",
      "Basic search filters",
      "Community forum access",
    ],
    ctaText: "Sign Up for Free",
    ctaLink: "/signup?plan=basic",
  },
  {
    tierName: "Premium",
    price: "$19",
    priceFrequency: "/month",
    description: "Unlock full access and advanced tools for success.",
    features: [
      "Unlimited access to mentors/mentees",
      "Unlimited messaging & video calls",
      "Advanced search filters",
      "Priority matching",
      "Progress tracking tools",
      "Priority support",
    ],
    ctaText: "Choose Premium",
    ctaLink: "/signup?plan=premium",
    isHighlighted: true,
  },
  {
    tierName: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for organizations and teams.",
    features: [
      "Custom onboarding for teams",
      "Dedicated account manager",
      "Admin dashboard & reporting",
      "Integration capabilities",
      "Customized workshops & events",
      "Volume discounts",
    ],
    ctaText: "Contact Us",
    ctaLink: "/contact-sales",
  },
];

export function PricingSection() {
  return (
    <SectionWrapper id="pricing" className="bg-secondary/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Flexible Plans to Fit Your Needs</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan to accelerate your career growth or mentorship impact.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {pricingTiers.map((tier) => (
          <PricingCard
            key={tier.tierName}
            tierName={tier.tierName}
            price={tier.price}
            priceFrequency={tier.priceFrequency}
            description={tier.description}
            features={tier.features}
            ctaText={tier.ctaText}
            ctaLink={tier.ctaLink}
            isHighlighted={tier.isHighlighted}
          />
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground mt-8">
        All prices are in USD. You can cancel or change your plan anytime.
      </p>
    </SectionWrapper>
  );
}
