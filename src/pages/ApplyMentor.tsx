"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/lib/supabaseClient";

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

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from("mentors").insert([formData]);

    setLoading(false);

    if (error) {
      console.error("Error submitting form:", error.message);
      alert("Failed to submit application.");
    } else {
      console.log("Submitted:", data);
      setSubmitted(true);
      // Redirect after a small delay (to show success message briefly)
      setTimeout(() => {
        window.location.href = "https://mentor-dashboard.netlify.app/dashboard";
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] to-[#111827] text-white">
      <Navigation />
      <div className="container mx-auto px-6 py-16 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          Apply as a Mentor
        </h1>
        <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl">
          Share your experience, guide the next generation, and make an impact through CareerDive.
        </p>

        <div className="w-full max-w-2xl bg-[#1F2937] rounded-3xl shadow-2xl p-10 backdrop-blur-md">
          {submitted ? (
            <div className="text-green-400 text-center text-2xl font-semibold">
              🎉 Application submitted successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: "Name", name: "mentors_name", type: "text" },
                { label: "Professional Title", name: "title", type: "text" },
                { label: "Area of Expertise", name: "area_of_expertise", type: "text" },
                { label: "College/University", name: "college", type: "text" },
                { label: "Years of Experience", name: "years_of_experience", type: "number" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "phno", type: "text" },
                { label: "LinkedIn Profile URL", name: "linkedin_url", type: "text" },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">{field.label}</label>
                  <Input
                    name={field.name}
                    type={field.type}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    className="bg-[#111827] border-gray-700 focus:border-blue-500"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-[#111827] border-gray-700 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Availability (Optional)</label>
                <Textarea
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="bg-[#111827] border-gray-700 focus:border-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 font-semibold text-lg py-6 rounded-xl"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyMentor;
