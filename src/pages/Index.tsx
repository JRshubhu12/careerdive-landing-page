
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PricingCard } from "@/components/PricingCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[#1A2238] text-[#3B82F6] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              Sessions starting at just ₹499
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Accelerate Your Career?
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of professionals who are advancing their careers with expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/get-started')}
                className="bg-[#3B82F6] hover:bg-[#2563EB]"
              >
                Get Started Now <ArrowRight className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#3B82F6]">5,000+</p>
              <p className="text-gray-400 mt-2">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#3B82F6]">300+</p>
              <p className="text-gray-400 mt-2">Expert Mentors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#3B82F6]">10,000+</p>
              <p className="text-gray-400 mt-2">Sessions Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#3B82F6]">95+</p>
              <p className="text-gray-400 mt-2">Satisfaction Rate %</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Session</h2>
            <p className="text-gray-400">
              Choose the session duration that fits your needs. No hidden fees or long-term commitments.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Quick Session"
              price="499"
              duration="30"
              description="Perfect for specific questions"
              features={[
                "Focused problem solving",
                "Resume quick review",
                "Career path guidance",
                "Interview preparation tips",
              ]}
            />
            <PricingCard
              title="Standard Session"
              price="799"
              duration="60"
              description="Our most popular option"
              features={[
                "In-depth discussion",
                "Complete resume review",
                "Personalized career planning",
                "Mock interview with feedback",
              ]}
              isBestSeller
            />
            <PricingCard
              title="Extended Session"
              price="1299"
              duration="120"
              description="For comprehensive guidance"
              features={[
                "Deep dive career consultation",
                "Portfolio & resume overhaul",
                "Detailed action plan creation",
                "Full mock interview & strategy",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#0D0F17]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories from Our Community</h2>
            <p className="text-gray-400">
              Hear from professionals who have transformed their careers with CareerDive.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              text="The mentorship I received through CareerDive was instrumental in landing my dream job. My mentor provided invaluable guidance on interview preparation."
              author="Alex Johnson"
              role="Software Engineer at Google"
              image="/lovable-uploads/1f3501c2-a1ee-4e63-a530-92f6a7239696.png"
            />
            <TestimonialCard
              text="After three sessions with my mentor, I completely revamped my resume and approach to interviews. I received multiple offers within a month!"
              author="Sarah Chen"
              role="Product Manager at Microsoft"
              image="/lovable-uploads/fb8ee448-6de9-4cc9-8480-a8a93e463b28.png"
            />
            <TestimonialCard
              text="My mentor helped me navigate the complex field of data science and provided practical advice that no bootcamp or course could offer."
              author="Michael Rodriguez"
              role="Data Scientist at Amazon"
              image="/lovable-uploads/ce0df28a-0874-4701-b1f3-caa528387610.png"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">
              Find answers to common questions about CareerDive.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How does CareerDive work?</AccordionTrigger>
                <AccordionContent>
                  CareerDive connects you with experienced industry professionals for 1:1 mentorship. Choose a mentor, book a session, and get personalized guidance for your career growth.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How much does it cost?</AccordionTrigger>
                <AccordionContent>
                  Sessions start at ₹499 for a 30-minute quick session. We offer different packages to suit your needs, with no hidden fees or long-term commitments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How are mentors vetted?</AccordionTrigger>
                <AccordionContent>
                  All our mentors go through a rigorous verification process. We check their professional experience, expertise, and commitment to mentoring before they join our platform.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CareerDive</h3>
              <p className="text-gray-400 text-sm">
                Connecting students with industry professionals for career guidance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">For Mentors</a></li>
                <li><a href="#" className="hover:text-white">For Students</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 CareerDive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
