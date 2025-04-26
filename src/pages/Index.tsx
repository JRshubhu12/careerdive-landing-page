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
              src="https://media.istockphoto.com/id/1322139094/photo/multiethnic-colleagues-sitting-at-desk-looking-at-laptop-computer-in-office.jpg?s=612x612&w=0&k=20&c=xrGP_nwtcdaZF8heKJ_FiEqnuqWxv1A7i71YZLXxSaE="
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
      <section id="how-it-works" className="relative py-24 bg-[#0D0F17] text-white overflow-hidden">
  <div className="container mx-auto px-6 relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
        How <span className="text-blue-500">CareerDive</span> Works
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">
        Start your journey in three simple, guided steps.
      </p>
    </div>

    <div className="flex flex-col md:flex-row md:justify-center gap-10 max-w-6xl mx-auto">
      {[
        {
          step: "Step 1",
          title: "Create Your Account",
          description: "Sign up and complete your profile to help us match you with the best mentors.",
          icon: "👤",
        },
        {
          step: "Step 2",
          title: "Find Your Mentor",
          description: "Browse through our vetted mentors and choose the right one based on your goals.",
          icon: "🔍",
        },
        {
          step: "Step 3",
          title: "Book Your Sessions",
          description: "Easily schedule 1:1 video calls at times that work for both you and your mentor.",
          icon: "📅",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="bg-[#161B29] p-8 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition hover:-translate-y-2 duration-300 w-full md:w-1/3 flex flex-col items-center text-center"
        >
          <div className="text-5xl mb-4">{item.icon}</div>
          <span className="text-sm uppercase tracking-widest text-blue-400 mb-2">{item.step}</span>
          <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
          <p className="text-gray-400 text-base">{item.description}</p>
        </div>
      ))}
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
            <TestimonialCard text="Landing my dream job was made possible with CareerDive's mentorship. Highly recommend it!" author="Alex Johnson" role="Software Engineer, Google" image="https://www.crucial.com.au/wp-content/uploads/2014/07/example-person.png" />
            <TestimonialCard text="In just three sessions, I completely revamped my resume and got multiple job offers." author="Sarah Chen" role="Product Manager, Microsoft" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScxxWUL3K0Vq1Ax9454RSfBkjJGup3RPeyaQ&s" />
            <TestimonialCard text="My mentor gave me real-world advice that no bootcamp could match. 10/10 experience!" author="Michael Rodriguez" role="Data Scientist, Amazon" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2K6dSK2LTI1l_AT9SOROl9MTBJzUuaNEzWQ&s" />
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
