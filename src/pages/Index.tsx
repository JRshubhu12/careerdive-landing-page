import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PricingCard } from "@/components/PricingCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-fade-in">
            <span className="inline-block bg-[#1A2238] text-[#3B82F6] text-xs md:text-sm font-semibold px-5 py-2 rounded-full mb-6 tracking-wide shadow-md">
              Sessions starting at just ₹499
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Supercharge Your Career Growth 🚀
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10">
              Personalized mentorship. Real-world insights. Your future, accelerated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/get-started")}
                className="bg-[#3B82F6] hover:bg-[#2563EB] transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-black transition-all"
              >
                Learn More
              </Button>
            </div>
            {/* Hero Image */}
            <img
              src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80"
              alt="Career Dive Mentorship"
              className="rounded-xl shadow-2xl mt-16 w-full max-w-3xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5,000+", label: "Active Users" },
              { number: "300+", label: "Expert Mentors" },
              { number: "10,000+", label: "Sessions Completed" },
              { number: "95%", label: "Satisfaction Rate" }
            ].map((item, idx) => (
              <div key={idx} className="hover:scale-105 transform transition duration-300">
                <p className="text-4xl md:text-5xl font-bold text-[#3B82F6]">{item.number}</p>
                <p className="text-gray-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0D0F17] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How CareerDive Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Getting started is simple. Find your mentor and begin your journey in three easy steps.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="border-l-4 border-blue-500 pl-6 space-y-12">
              {[
                {
                  title: "Create Your Account",
                  description: "Sign up and complete your profile to help us match you with the right mentors.",
                },
                {
                  title: "Find Your Mentor",
                  description: "Browse our network of industry professionals and choose the perfect match for your goals.",
                },
                {
                  title: "Book Your Sessions",
                  description: "Schedule 1:1 video calls sessions at times that work for you and your mentor.",
                },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-8 top-1 text-xl bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Session</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Pick a mentorship plan that matches your career goals — flexible and affordable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard title="Quick Session" price="499" duration="30" description="Perfect for quick questions" features={["Focused problem solving", "Resume quick review", "Career guidance", "Interview tips"]} />
            <PricingCard title="Standard Session" price="799" duration="60" description="Best for career growth" features={["Deep dive discussion", "Full resume review", "Career planning", "Mock interview"]} isBestSeller />
            <PricingCard title="Extended Session" price="1299" duration="120" description="In-depth mentorship" features={["Portfolio audit", "Career roadmap", "Mock interview & feedback", "Action plan creation"]} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#0D0F17]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Hear how CareerDive is changing lives — one mentorship at a time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard text="Landing my dream job was made possible with CareerDive's mentorship. Highly recommend it!" author="Alex Johnson" role="Software Engineer, Google" image="/lovable-uploads/1f3501c2-a1ee-4e63-a530-92f6a7239696.png" />
            <TestimonialCard text="In just three sessions, I completely revamped my resume and got multiple job offers." author="Sarah Chen" role="Product Manager, Microsoft" image="/lovable-uploads/fb8ee448-6de9-4cc9-8480-a8a93e463b28.png" />
            <TestimonialCard text="My mentor gave me real-world advice that no bootcamp could match. 10/10 experience!" author="Michael Rodriguez" role="Data Scientist, Amazon" image="/lovable-uploads/ce0df28a-0874-4701-b1f3-caa528387610.png" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Have questions? We've got you covered.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How does CareerDive work?</AccordionTrigger>
                <AccordionContent>
                  CareerDive connects you with industry-leading mentors. Choose your mentor, book a session, and get personalized advice.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How much does it cost?</AccordionTrigger>
                <AccordionContent>
                  Pricing starts at just ₹499. No hidden fees. Choose a plan that works for you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are mentors verified?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. Every mentor goes through a strict vetting process to ensure expertise and professionalism.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">CareerDive</h3>
              <p className="text-sm">Connecting students and professionals through world-class mentorship.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Mentors</a></li>
                <li><a href="#" className="hover:text-white">Students</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2025 CareerDive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
