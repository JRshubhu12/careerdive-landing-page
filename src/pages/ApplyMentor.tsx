"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

// --- Availability Helper Data ---
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const daysOfWeek: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// 24-hour format time options
const timeOptions = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

const defaultWeeklyAvailability = () => {
  const initial: any = {};
  daysOfWeek.forEach((day) => {
    initial[day] = {
      enabled: false,
      slots: [],
      start: "09:00",
      end: "20:00",
    };
  });
  return initial;
};

// --- Modern Time Picker ---
function ModernTimePicker({
  value,
  onChange,
  label,
  options = timeOptions,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  options?: string[];
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      {label && <span className="text-xs text-[#3232eb] font-medium">{label}</span>}
      <div className="relative w-[92px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border-2 border-[#3232eb] bg-white text-[#211e6a] px-3 py-1.5 font-mono shadow-md focus:ring-2 focus:ring-[#3232eb] focus:border-[#3232eb] w-full pr-7 transition-all duration-150 appearance-none"
          style={{
            paddingRight: "2.2rem",
          }}
        >
          {options.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="#3232eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

function ModernAddSlotButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3232eb] to-[#211e6a] text-white font-semibold shadow-md hover:scale-105 active:scale-100 transition-transform duration-150"
      onClick={onClick}
      title="Add time slot"
    >
      +
      Add Slot
    </button>
  );
}

function ModernRemoveSlotButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="ml-1 text-white bg-gradient-to-r from-[#ff5f6d] to-[#ffc371] px-2 py-1 rounded-full shadow hover:scale-110 active:scale-100 transition"
      onClick={onClick}
      title="Remove slot"
    >
      ×
    </button>
  );
}

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
    availability: "",
    profile_pic_url: "",
  });

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- AVAILABILITY STATE ---
  const [weeklySchedule, setWeeklySchedule] = useState<any>(defaultWeeklyAvailability());

  // --- AVAILABILITY HANDLERS ---
  const handleToggleDay = (day: DayOfWeek) => {
    setWeeklySchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (
    day: DayOfWeek,
    type: "start" | "end",
    value: string
  ) => {
    setWeeklySchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const handleAddTimeSlot = (day: DayOfWeek) => {
    setWeeklySchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { start: prev[day].start, end: prev[day].end },
        ],
        enabled: true,
      },
    }));
  };

  const handleRemoveSlot = (day: DayOfWeek, idx: number) => {
    setWeeklySchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_: any, i: number) => i !== idx),
        enabled: prev[day].slots.length > 1 ? true : false,
      },
    }));
  };

  // --- FORM LOGIC ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? Number(value) : value,
    }));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const uploadProfilePic = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicUrl = "";

      if (profilePicFile) {
        profilePicUrl = await uploadProfilePic(profilePicFile);
      }

      // Serialize availability for DB
      const availability = JSON.stringify({
        weeklySchedule,
      });

      const { data, error } = await supabase.from("mentors").insert([
        {
          ...formData,
          profile_pic_url: profilePicUrl,
          availability,
        },
      ]);

      if (error) {
        console.error("Error submitting form:", error.message);
        alert("Failed to submit application.");
      } else {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = "https://mentor-dashboard.netlify.app/dashboard";
        }, 1500);
      }
    } catch (err: any) {
      console.error("Upload error:", err.message);
      alert("Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
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

        <div className="w-full max-w-2xl bg-gradient-to-tr from-[#23235c] via-[#25277d] to-[#3232eb] rounded-3xl shadow-2xl p-10 backdrop-blur-md border-2 border-[#53a0fd]">
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
                <div
                  key={idx}
                  className="rounded-xl bg-white border-2 border-[#53a0fd] shadow px-4 py-3 flex flex-col"
                >
                  <label className="text-[#23235c] mb-1 text-sm font-semibold tracking-wide">
                    {field.label}
                  </label>
                  <Input
                    name={field.name}
                    type={field.type}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    className="bg-white border-[#53a0fd] focus:border-blue-500 text-[#23235c] placeholder-gray-500"
                    required
                  />
                </div>
              ))}

              <div className="rounded-xl bg-white border-2 border-[#53a0fd] shadow px-4 py-3 flex flex-col">
                <label className="text-[#23235c] mb-1 text-sm font-semibold tracking-wide">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-white border-[#53a0fd] focus:border-blue-500 text-[#23235c] placeholder-gray-500"
                  required
                />
              </div>

              {/* AVAILABILITY SECTION */}
              <div className="rounded-xl bg-white border-2 border-[#53a0fd] shadow px-4 py-3">
                <label className="block text-[#23235c] mb-2 text-sm font-semibold tracking-wide">
                  Availability <span className="text-gray-500 font-normal">(Select days and time slots)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className={`rounded-2xl shadow-md p-5 bg-gradient-to-tr from-[#eaf0ff] to-[#c8d6ff] border-2 transition
                        ${weeklySchedule[day].enabled ? "border-[#3232eb]" : "border-gray-300 opacity-80"}
                      `}
                    >
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={weeklySchedule[day].enabled}
                          onChange={() => handleToggleDay(day)}
                          className="h-5 w-5 accent-[#3232eb] rounded-full outline-none border-2 border-[#3232eb] mr-2"
                          id={day}
                        />
                        <label
                          htmlFor={day}
                          className={`text-base font-semibold tracking-wide ${weeklySchedule[day].enabled ? "text-[#211e6a]" : "text-gray-400"}`}
                        >
                          {day}
                        </label>
                      </div>
                      {weeklySchedule[day].enabled ? (
                        <>
                          <div className="flex flex-col gap-2">
                            {weeklySchedule[day].slots.length === 0 && (
                              <div className="text-xs text-gray-400 italic">No slots added</div>
                            )}
                            {weeklySchedule[day].slots.map((slot: { start: string; end: string }, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-white border border-[#53a0fd] rounded-xl px-3 py-2 shadow"
                              >
                                <ModernTimePicker
                                  value={slot.start}
                                  onChange={(v) => {
                                    const newSlots = [...weeklySchedule[day].slots];
                                    newSlots[idx].start = v;
                                    setWeeklySchedule((prev: any) => ({
                                      ...prev,
                                      [day]: { ...prev[day], slots: newSlots },
                                    }));
                                  }}
                                  label="Start"
                                />
                                <span className="mx-1 text-[#3232eb] font-bold">-</span>
                                <ModernTimePicker
                                  value={slot.end}
                                  onChange={(v) => {
                                    const newSlots = [...weeklySchedule[day].slots];
                                    newSlots[idx].end = v;
                                    setWeeklySchedule((prev: any) => ({
                                      ...prev,
                                      [day]: { ...prev[day], slots: newSlots },
                                    }));
                                  }}
                                  label="End"
                                />
                                <ModernRemoveSlotButton
                                  onClick={() => handleRemoveSlot(day, idx)}
                                />
                              </div>
                            ))}
                            <div className="mt-2">
                              <ModernAddSlotButton onClick={() => handleAddTimeSlot(day)} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400 text-sm mt-2">Unavailable</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white border-2 border-[#53a0fd] shadow px-4 py-3 flex flex-col">
                <label className="text-[#23235c] mb-1 text-sm font-semibold tracking-wide">
                  Profile Picture (Optional)
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="bg-white border-none focus:ring-0 text-[#23235c] placeholder-gray-500"
                />
                {profilePicPreview && (
                  <div className="mt-4 flex flex-col items-center space-y-2">
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="h-32 w-32 rounded-full object-cover border-2 border-blue-400"
                    />
                    <p className="text-sm text-gray-400">Profile picture preview</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 font-semibold text-lg py-6 rounded-xl mt-4"
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