import { SectionWrapper } from './SectionWrapper';
import { TestimonialCard } from './TestimonialCard';

const testimonials = [
  {
    quote: "CareerDive helped me find a mentor who completely changed my career trajectory. I'm so grateful!",
    name: "Shubham K.",
    role: "Full Stack Developer",
    avatarUrl: "https://placehold.co/80x80.png?a=1",
    rating: 5,
  },
  {
    quote: "As a mentor, I've found it incredibly rewarding to guide and support the next generation of professionals through CareerDive.",
    name: "Dr. Anya Sharma",
    role: "Experienced Industry Professional",
    avatarUrl: "https://placehold.co/80x80.png?a=2",
    rating: 5,
  },
  {
    quote: "The matching algorithm is fantastic! I was connected with a mentee whose goals perfectly aligned with my expertise.",
    name: "Michael B.",
    role: "Senior Marketing Manager",
    avatarUrl: "https://placehold.co/80x80.png?a=3",
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper id="testimonials">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Hear from Our Successful Users</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Real stories from people who've transformed their careers with CareerDive.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.name}
            quote={testimonial.quote}
            name={testimonial.name}
            role={testimonial.role}
            avatarUrl={testimonial.avatarUrl}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
