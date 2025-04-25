
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed w-full z-50 bg-[#0A0A0B]/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#3B82F6]">CareerDive</a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white">How It Works</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white">Testimonials</a>
            <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-white">FAQ</a>
          </div>
          <Button 
            onClick={() => navigate('/get-started')}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
