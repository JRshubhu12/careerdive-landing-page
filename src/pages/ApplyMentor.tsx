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
function getTimeOptions() {
  const options: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    options.push(
      `${hour.toString().padStart(2, "0")}:00`,
      hour < 22 ? `${hour.toString().padStart(2, "0")}:30` : undefined
    );
  }
  return options.filter(Boolean) as string[];
}
const timeOptions = getTimeOptions();

const defaultWeeklyAvailability = () => {
  const initial: any = {};
  daysOfWeek.forEach((day) => {
    initial[day] = {
      enabled: false,
      slots: [],
      start: "09:00",
      end: "10:00",
    };
  });
  return initial;
};

// --- Modern Time Picker (as in slots page) ---
function ModernTimePicker({
  value,
  onChange,
  label,
  options = timeOptions,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  options?: string[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-1 min-w-[80px] flex-1">
      {label && <span className="text-xs text-[#3232eb] font-medium">{label}</span>}
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`rounded-lg border-2 border-[#3232eb] bg-white text-[#211e6a] px-3 py-1 font-mono shadow-md focus:ring-2 focus:ring-[#3232eb] focus:border-[#3232eb] w-full transition-all duration-150 appearance-none ${disabled ? "opacity-60 pointer-events-none" : ""}`}
          disabled={disabled}
        >
          {options.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="#3232eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

function ModernAddSlotButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-full bg-[#3232eb] hover:bg-[#211e6a] text-white font-bold shadow-lg border-2 border-[#211e6a] transition-all duration-150 focus:ring-2 focus:ring-[#3232eb] focus:outline-none w-10 h-10 min-w-[40px] min-h-[40px] ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={onClick}
      title="Add Slot"
      disabled={disabled}
      style={{boxShadow: "0 2px 8px #3232eb33"}}
    >
      +
    </button>
  );
}

function ModernRemoveSlotButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="ml-1 px-2 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
      onClick={onClick}
      title="Remove slot"
    >
      ×
    </button>
  );
}

// --- EMAIL VALIDATION ---
function isValidEmail(email: string): boolean {
  // Only allow valid email with .com TLD
  const regex = /^[^\s@]+@[^\s@]+\.[cC][oO][mM]$/;
  return regex.test(email);
}

// --- SEND CONFIRMATION EMAIL (using Supabase Edge Function or external API) ---
// NOTE: Update this to your actual email sending logic (e.g. Supabase Edge, SendGrid, etc.)
async function sendConfirmationEmail(email: string, mentorsName: string) {
  // Example: Call Supabase Edge Function or API endpoint to send email
  const response = await fetch("/api/send-mentor-confirmation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      name: mentorsName
    })
  });

  if (!response.ok) {
    throw new Error("Failed to send confirmation email.");
  }
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
  const [authenticating, setAuthenticating] = useState(false);

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

  const slotExists = (day: DayOfWeek, start: string, end: string) => {
    return weeklySchedule[day].slots.some(
      (slot: any) => slot.start === start && slot.end === end
    );
  };

  const isOverlappingSlot = (day: DayOfWeek, newStart: string, newEnd: string): boolean => {
    function toMinutes(t: string) {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    }
    const newStartMin = toMinutes(newStart);
    const newEndMin = toMinutes(newEnd);
    return weeklySchedule[day].slots.some((slot: any) => {
      const slotStart = toMinutes(slot.start);
      const slotEnd = toMinutes(slot.end);
      return newStartMin < slotEnd && slotStart < newEndMin;
    });
  };

  const handleAddTimeSlot = (day: DayOfWeek) => {
    const start = weeklySchedule[day].start;
    const end = weeklySchedule[day].end;
    if (
      slotExists(day, start, end) ||
      isOverlappingSlot(day, start, end)
    ) return;
    setWeeklySchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { start, end },
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
    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  // --- AUTHENTICATE EMAIL (sign up if not exists, sign in if exists, using Supabase Auth) ---
  // You may want to handle "user already exists" gracefully!
  const authenticateUser = async (email: string) => {
    setAuthenticating(true);

    // Try sign in (if user exists, send a magic link)
    let { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/mentor-confirmed"
      }
    });

    setAuthenticating(false);
    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation for .com only
    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address ending with .com");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate user via Supabase Auth (magic link to email)
      await authenticateUser(formData.email);

      let profilePicUrl = "";

      if (profilePicFile) {
        profilePicUrl = await uploadProfilePic(profilePicFile);
      }

      // Serialize availability for DB
      const availability = JSON.stringify({
        weeklySchedule,
      });

      // 2. Insert mentor application into database
      const { error } = await supabase.from("mentors").insert([
        {
          ...formData,
          profile_pic_url: profilePicUrl,
          availability,
        },
      ]);

      if (error) {
        console.error("Error submitting form:", error.message);
        alert("Failed to submit application.");
        setLoading(false);
        return;
      }

      // 3. Send confirmation email
      try {
        await sendConfirmationEmail(formData.email, formData.mentors_name);
      } catch (mailErr: any) {
        // Log but let user continue
        console.error("Confirmation email error:", mailErr.message);
      }

      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "https://mentor-dashboard.netlify.app/dashboard";
      }, 1500);

    } catch (err: any) {
      console.error("Submission error:", err.message);
      alert(err.message || "Failed to submit application.");
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
              🎉 Application submitted successfully!<br />
              A confirmation email has been sent to your email address.
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
                  {field.name === "email" && formData.email && !isValidEmail(formData.email) && (
                    <span className="text-xs text-red-600 pt-1">
                      Enter a valid .com email address.
                    </span>
                  )}
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

              {/* AVAILABILITY SECTION - MODERN SLOTSPAGE DESIGN */}
              <div className="rounded-xl bg-white border-2 border-[#53a0fd] shadow px-4 py-3">
                <label className="block text-[#23235c] mb-2 text-sm font-semibold tracking-wide">
                  Availability <span className="text-gray-500 font-normal">(Select days and time slots)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {daysOfWeek.map((day) => {
                    const isDuplicate = slotExists(
                      day,
                      weeklySchedule[day].start,
                      weeklySchedule[day].end
                    );
                    const overlap = isOverlappingSlot(
                      day,
                      weeklySchedule[day].start,
                      weeklySchedule[day].end
                    );
                    return (
                      <div
                        key={day}
                        className={`rounded-2xl shadow-md p-4 bg-gradient-to-tr from-white via-[#f4f7ff] to-[#eaf0ff] border-2 transition
                          ${weeklySchedule[day].enabled ? "border-[#3232eb]" : "border-gray-200 opacity-75"}
                        `}
                      >
                        <div>
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
                            <div className="flex flex-col gap-2">
                              {weeklySchedule[day].slots.length === 0 && (
                                <div className="text-xs text-gray-400 italic">No slots added</div>
                              )}
                              {weeklySchedule[day].slots.map((slot: { start: string; end: string }, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-gradient-to-r from-[#eaf0ff] to-[#c8d6ff] rounded-xl px-2 py-2 shadow"
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
                                  />
                                  <ModernRemoveSlotButton
                                    onClick={() => handleRemoveSlot(day, idx)}
                                  />
                                </div>
                              ))}
                              <div className="flex flex-row flex-wrap items-end gap-2 mt-2">
                                <ModernTimePicker
                                  value={weeklySchedule[day].start}
                                  onChange={(v) => handleTimeChange(day, "start", v)}
                                />
                                <span className="mx-1 text-[#3232eb] font-bold">-</span>
                                <ModernTimePicker
                                  value={weeklySchedule[day].end}
                                  onChange={(v) => handleTimeChange(day, "end", v)}
                                />
                                <ModernAddSlotButton
                                  onClick={() => handleAddTimeSlot(day)}
                                  disabled={isDuplicate || overlap}
                                />
                              </div>
                              {(overlap || isDuplicate) && (
                                <div className="text-xs text-red-600 mt-1 font-medium max-w-full whitespace-normal break-words">
                                  {overlap
                                    ? "Your slot is already booked or overlaps with another slot."
                                    : "This exact slot already exists."}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm mt-2">Unavailable</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                disabled={loading || authenticating}
              >
                {loading
                  ? "Submitting..."
                  : authenticating
                  ? "Sending authentication email..."
                  : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyMentor;