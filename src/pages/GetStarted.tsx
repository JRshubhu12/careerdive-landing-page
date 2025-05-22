import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const GetStarted = () => {
  const navigate = useNavigate();

  // Check if user has already applied as mentor. You can adjust this logic as needed.
  // For example, check localStorage or a cookie, or make an API call if required.
  useEffect(() => {
    const hasAppliedMentor = localStorage.getItem("mentor_applied");
    if (hasAppliedMentor === "true") {
      window.location.href = "https://mentor-dashboard.netlify.app/auth";
    }
  }, []);

  const handleMentorApply = () => {
    // Mark as applied in localStorage
    localStorage.setItem("mentor_applied", "true");
    // Redirect to mentor dashboard directly
    window.location.href = "https://mentor-dashboard.netlify.app/auth";
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
            <div className="w-32 h-32 rounded-full bg-[#1A2238] flex items-center justify-center mb-6 overflow-hidden">
              <img
                src="https://preview.redd.it/finally-met-johnny-sins-v0-sidxefmycuy91.jpg?width=554&format=pjpg&auto=webp&s=e5b4793957b72e31e214c863d01272a37ebf7503"
                alt="Mentee"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">I'm a Mentee</h2>
            <p className="text-gray-400 mb-8">
              Looking for guidance from industry professionals to accelerate my career growth.
            </p>
            <Button
              onClick={() => window.location.href = "https://career-dive.netlify.app/"}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Sign Up as a Student <ArrowRight className="ml-2" />
            </Button>
            <div className="h-4" />

            <Button
              onClick={() => window.location.href = "https://career-dive.netlify.app/student/dashboard"}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Login to Your Dashboard <ArrowRight className="ml-2" />
            </Button>
          </Card>

          <Card className="bg-[#12141D] border-0 p-8 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="w-32 h-32 rounded-full bg-[#1A2238] flex items-center justify-center mb-6 relative overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSktspfAGgaDS23h2B_-0THTS395YZA1HOrWQ&s"
                alt="Mentor"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">I'm a Mentor</h2>
            <p className="text-gray-400 mb-8">
              Ready to share my expertise and guide students on their professional journey.
            </p>
            <div className="w-full space-y-3">
              <Button
                // If user clicks Apply as a Mentor, mark as applied and redirect
                onClick={handleMentorApply}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              >
                Apply as a Mentor <ArrowRight className="ml-2" />
              </Button>
              <Button
                onClick={() => window.location.href = "https://mentor-dashboard.netlify.app/dashboard"}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Login to Your Dashboard <ArrowRight className="ml-2" />
              </Button>
            </div>
          </Card>
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