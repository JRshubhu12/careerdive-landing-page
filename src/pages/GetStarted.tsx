
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold mb-8">Choose Your Path</h2>
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-64 bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/signup-mentee')}
          >
            Sign up as Mentee
          </Button>
          <div className="block">
            <Button 
              size="lg" 
              variant="outline"
              className="w-64"
              onClick={() => navigate('/apply-mentor')}
            >
              Apply as Mentor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
