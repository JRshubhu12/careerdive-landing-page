import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";

const ApplyMentor = () => {
  const [formData, setFormData] = useState({
    mentors_name: "",
    title: "",
    area_of_expertise: "",
    college: "",
    years_of_experience: 0,
    description: "",
    email: "",
    phno: "",
    linkedin_url: "",
    availability: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_of_experience' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Apply as a Mentor</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Name</label>
              <Input
                name="mentors_name"
                value={formData.mentors_name}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Professional Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Area of Expertise</label>
              <Input
                name="area_of_expertise"
                value={formData.area_of_expertise}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">College/University</label>
              <Input
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Years of Experience</label>
              <Input
                type="number"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <Textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Phone Number</label>
              <Input
                name="phno"
                value={formData.phno}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">LinkedIn Profile URL</label>
              <Input
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Availability</label>
              <Textarea 
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="bg-[#1A1F2C] border-gray-700"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB]"
            >
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyMentor;
