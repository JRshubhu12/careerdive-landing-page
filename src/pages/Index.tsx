
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-700">CareerDive</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/get-started')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          Connect with Industry Mentors
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Get personalized guidance from experienced professionals and accelerate your career growth
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/get-started')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">1:1 Mentorship</h3>
            <p className="text-gray-600">Connect with industry experts for personalized guidance</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Career Growth</h3>
            <p className="text-gray-600">Accelerate your professional development with expert advice</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Networking</h3>
            <p className="text-gray-600">Build valuable connections in your industry</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
