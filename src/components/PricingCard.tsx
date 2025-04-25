
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  isBestSeller?: boolean;
}

export const PricingCard = ({ 
  title, 
  price, 
  duration, 
  description, 
  features, 
  isBestSeller 
}: PricingCardProps) => {
  return (
    <Card className={`p-6 bg-[#12141D] border ${isBestSeller ? 'border-[#3B82F6]' : 'border-gray-800'}`}>
      {isBestSeller && (
        <div className="mb-4">
          <span className="bg-[#3B82F6] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Best Seller
          </span>
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="mb-4">
        <span className="text-3xl font-bold text-white">₹{price}</span>
      </div>
      <div className="bg-[#1A1F2C] p-3 rounded-md mb-6 text-center">
        <span className="text-white">{duration} minutes</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <svg
              className="w-5 h-5 text-[#3B82F6] mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full ${
          isBestSeller 
            ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white' 
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
      >
        Book Now
      </Button>
    </Card>
  );
};
