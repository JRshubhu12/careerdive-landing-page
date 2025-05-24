import { SectionWrapper } from './SectionWrapper';
import { PricingCard } from './PricingCard';

const pricingTiers = [
  {
    tierName: "Starter",
    price: "₹499",
    priceFrequency: "/month",
    description: "Ideal for focused guidance and getting started.",
    features: [
      "30 mins session per month",
      "Access to mentor/mentee profiles",
      "Basic search filters",
      "Community forum access",
    ],
    ctaText: "Sign Up for Starter",
    ctaLink: "/signup?plan=starter",
  },
  {
    tierName: "Pro",
    price: "₹799",
    priceFrequency: "/month",
    description: "Comprehensive support for accelerated growth.",
    features: [
      "60 mins session per month",
      "Unlimited access to mentors/mentees",
      "Unlimited messaging & video calls",
      "Advanced search filters",
      "Priority matching",
      "Progress tracking tools",
    ],
    ctaText: "Choose Pro",
    ctaLink: "/signup?plan=pro",
    isHighlighted: true,
  },
  {
    tierName: "Premium Plus",
    price: "₹1299",
    priceFrequency: "/month",
    description: "Extensive mentorship for maximum impact and results.",
    features: [
      "2 hours session per month",
      "All Pro features included",
      "Dedicated success manager",
      "Exclusive workshops & resources",
      "Priority support",
    ],
    ctaText: "Choose Premium Plus",
    ctaLink: "/signup?plan=premium-plus",
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
        All prices are in INR. You can cancel or change your plan anytime.
      </p>
    </SectionWrapper>
  );
}
