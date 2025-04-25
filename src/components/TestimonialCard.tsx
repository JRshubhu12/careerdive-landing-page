
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TestimonialCardProps {
  text: string;
  author: string;
  role: string;
  image: string;
}

export const TestimonialCard = ({ text, author, role, image }: TestimonialCardProps) => {
  return (
    <Card className="p-6 bg-[#12141D] border-gray-800">
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-5 h-5 text-[#3B82F6]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>
      <p className="text-gray-300 mb-6 italic">{text}</p>
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={image} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-semibold">{author}</p>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </Card>
  );
};
