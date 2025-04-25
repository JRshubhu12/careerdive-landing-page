import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const handleStudentSignup = () => {
    window.open("https://career-dive.netlify.app/", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Choose Your Path</h1>
          <p className="text-gray-400 text-lg">
            Select the option that best describes your goals on CareerDive
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-[#12141D] border-0 p-8 flex flex-col items-center text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-32 h-32 rounded-full bg-[#1A2238] flex items-center justify-center mb-6">
              <img
                src="/lovable-uploads/b07db249-ce09-4d60-b4fb-ba869faeb9fc.png"
                alt="Mentee"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4">I'm a Mentee</h2>
            <p className="text-gray-400 mb-8">
              Looking for guidance from industry professionals to accelerate my career growth
            </p>
            <Button 
              onClick={handleStudentSignup}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Sign Up as a Student <ArrowRight className="ml-2" />
            </Button>
          </Card>

          <Card className="bg-[#12141D] border-0 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-[#1A2238] flex items-center justify-center mb-6">
              <img
                src="/lovable-uploads/b07db249-ce09-4d60-b4fb-ba869faeb9fc.png"
                alt="Mentor"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4">I'm a Mentor</h2>
            <p className="text-gray-400 mb-8">
              Ready to share my expertise and guide students on their professional journey
            </p>
            <Button 
              onClick={() => navigate('/apply-mentor')}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Apply as a Mentor <ArrowRight className="ml-2" />
            </Button>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-[#3B82F6] hover:underline">
              Log in
            </a>
          </p>
        </div>

        <footer className="mt-20 text-gray-400 text-sm">
          <div className="flex justify-between items-center">
            <p>© 2025 CareerDive. All rights reserved.</p>
            <div className="space-x-4">
              <a href="/terms" className="hover:text-white">Terms</a>
              <a href="/privacy" className="hover:text-white">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GetStarted;
