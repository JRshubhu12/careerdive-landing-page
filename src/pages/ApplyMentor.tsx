"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

interface MentorFormData {
  mentors_name: string;
  title: string;
  area_of_expertise: string;
  college: string;
  years_of_experience: number;
  description: string;
  email: string;
  phno: string;
  linkedin_url: string;
  availability: string;
  profile_pic_url: string;
  gender: string;
  skills: string[];
}

interface DayAvailability {
  enabled: boolean;
  slots: { start: string; end: string }[];
  start: string;
  end: string;
}

const daysOfWeek: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const genderOptions = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
];
const skillOptions = [
  "Career Counseling",
  "Technical Interview Prep",
  "Resume Review",
  "Leadership",
  "Product Management",
  "Software Engineering",
  "Data Science",
  "Machine Learning",
  "UX Design",
  "Entrepreneurship",
];

function getTimeOptions() {
  const options: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    options.push(
      `${hour.toString().padStart(2, "0")}:00`,
      hour < 22 ? `${hour.toString().padStart(2, "0")}:30` : ""
    );
  }
  return options.filter(Boolean) as string[];
}
const timeOptions = getTimeOptions();

const defaultWeeklyAvailability = () => {
  const initial: Record<DayOfWeek, DayAvailability> = {} as Record<
    DayOfWeek,
    DayAvailability
  >;
  daysOfWeek.forEach((day) => {
    initial[day] = {
      enabled: false,
      slots: [],
      start: "09:00",
      end: "17:00",
    };
  });
  return initial;
};

const TimeSlotDisplay = ({ start, end }: { start: string; end: string }) => (
  <div className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-blue-800 shadow-sm">
    <span>{start}</span>
    <span className="mx-1">-</span>
    <span>{end}</span>
  </div>
);

const TimePicker = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm shadow focus:ring-2 focus:ring-blue-400"
  >
    {timeOptions.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
  </select>
);

const SkillTag = ({
  skill,
  selected,
  onClick,
}: {
  skill: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors shadow-sm border ${
      selected
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50"
    }`}
  >
    {skill}
  </button>
);

// Only accept .com emails, not more than one . and must be valid
function isValidEmail(email: string): boolean {
  // Only one @, only one ., must end with .com, and cannot have . before @ or consecutive dots
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.com$/;
  if (!emailPattern.test(email)) return false;
  if ((email.match(/\./g) || []).length > 1) return false; // only one dot allowed (the .com)
  return true;
}
function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

async function sendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/mentor-confirmed`,
    },
  });
  if (error) throw error;
}

function openGmailApp(email: string) {
  const gmailUrl = `googlegmail:///co?to=${encodeURIComponent(email)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(email)}`;
  window.location.href = gmailUrl;
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 500);
}

const ApplyMentor = () => {
  const [formData, setFormData] = useState<MentorFormData>({
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
    gender: "",
    skills: [],
  });

  const [weeklySchedule, setWeeklySchedule] = useState(defaultWeeklyAvailability());
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Form Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Email lock logic: if already a valid .com, don't allow further input
    if (name === "email") {
      if (formData.email && isValidEmail(formData.email)) return; // lock if valid
      // Enforce: if value is valid .com, block further edits
      if (isValidEmail(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        // Lock by not updating further unless backspace
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? Number(value) : value,
    }));
  };

  // Manual email lock: after valid, make it readonly
  const emailLocked = isValidEmail(formData.email);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 5 * 1024 * 1024) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    } else if (file) {
      setError("Please select an image smaller than 5MB");
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  // --- Availability Handlers ---
  const handleToggleDay = (day: DayOfWeek) => {
    setWeeklySchedule((prev) => ({
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
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const slotExists = (day: DayOfWeek, start: string, end: string) => {
    return weeklySchedule[day].slots.some(
      (slot) => slot.start === start && slot.end === end
    );
  };

  const isOverlappingSlot = (
    day: DayOfWeek,
    newStart: string,
    newEnd: string
  ) => {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const newStartMin = toMinutes(newStart);
    const newEndMin = toMinutes(newEnd);

    return weeklySchedule[day].slots.some((slot) => {
      const slotStart = toMinutes(slot.start);
      const slotEnd = toMinutes(slot.end);
      return newStartMin < slotEnd && slotStart < newEndMin;
    });
  };

  const handleAddTimeSlot = (day: DayOfWeek) => {
    const { start, end } = weeklySchedule[day];

    if (start >= end) {
      setError("End time must be after start time");
      return;
    }

    if (slotExists(day, start, end)) {
      setError("This time slot already exists");
      return;
    }

    if (isOverlappingSlot(day, start, end)) {
      setError("This time slot overlaps with an existing slot");
      return;
    }

    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start, end }],
        enabled: true,
      },
    }));
    setError(null);
  };

  const handleRemoveSlot = (day: DayOfWeek, idx: number) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== idx),
        enabled: prev[day].slots.length > 1,
      },
    }));
  };

  // --- Supabase Operations ---
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

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(formData.email)) {
      setError("Please use a valid .com email address (e.g. user@email.com) and only one dot is allowed.");
      return;
    }
    if (!isValidPhone(formData.phno)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (formData.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }
    setLoading(true);

    try {
      let profilePicUrl = "";
      if (profilePicFile) {
        profilePicUrl = await uploadProfilePic(profilePicFile);
      }

      const availability = JSON.stringify({ weeklySchedule });

      const { error: dbError } = await supabase.from("mentors").insert([
        {
          ...formData,
          profile_pic_url: profilePicUrl,
          availability,
          skills: formData.skills,
        },
      ]);
      if (dbError) {
        setError("Failed to submit application: " + dbError.message);
        setLoading(false);
        return;
      }

      try {
        await sendConfirmationEmail(formData.email);
        openGmailApp(formData.email);
      } catch (err: any) {
        setSuccess(
          "Application submitted. Confirmation email could not be sent. Please contact support if you do not receive an email."
        );
        setSubmitted(true);
        setLoading(false);
        return;
      }

      setSuccess(
        "Application submitted successfully! A confirmation email has been sent to your email address."
      );
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100">
      <Navigation />
      <div className="max-w-4xl mx-auto px-3 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">
            Become a Mentor
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Share your knowledge and help shape the future of aspiring professionals.
          </p>
        </div>
        {error && (
          <div className="mb-4 text-red-700 bg-red-100 border border-red-300 px-4 py-3 rounded-lg text-center shadow">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 px-4 py-3 rounded-lg text-center shadow">
            {success}
          </div>
        )}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          {submitted ? (
            <div className="flex flex-col items-center py-12">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-2">
                We have received your mentor application.<br />
                {success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="mentors_name"
                      value={formData.mentors_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleSelectChange}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700"
                    >
                      <option value="">Select</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address <span style={{color: "#e53e3e"}}>*</span>
                      <span style={{ display: "block", fontSize: 12, color: "#718096" }}>
                        Only valid <b>.com</b> emails are accepted. Only one dot (.) is allowed after @. Once filled, cannot be changed.
                      </span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      readOnly={emailLocked}
                      style={emailLocked ? { backgroundColor: "#e2e8f0", color: "#888" } : undefined}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span style={{color: "#e53e3e"}}>*</span>
                      <span style={{ display: "block", fontSize: 12, color: "#718096" }}>
                        Enter a valid 10-digit phone number.
                      </span>
                    </label>
                    <Input
                      type="tel"
                      name="phno"
                      value={formData.phno}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      minLength={10}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4">
                    <div>
                      {profilePicPreview ? (
                        <img
                          src={profilePicPreview}
                          alt="Profile preview"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <svg
                            className="h-10 w-10 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <label className="block">
                      <span className="sr-only">Upload photo</span>
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-600
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                        onChange={handleProfilePicChange}
                        accept="image/*"
                      />
                      <span className="text-xs text-gray-400">
                        JPEG or PNG, max 5MB
                      </span>
                    </label>
                  </div>
                </div>
              </section>
              {/* Professional Details */}
              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area of Expertise
                    </label>
                    <Input
                      type="text"
                      name="area_of_expertise"
                      value={formData.area_of_expertise}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College/University
                    </label>
                    <Input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <Input
                      type="number"
                      name="years_of_experience"
                      min="0"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <Input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {skillOptions.map((skill) => (
                        <SkillTag
                          key={skill}
                          skill={skill}
                          selected={formData.skills.includes(skill)}
                          onClick={() => toggleSkill(skill)}
                        />
                      ))}
                    </div>
                    {formData.skills.length === 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        Please select at least one skill
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Bio
                    </label>
                    <Textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your professional journey and why you want to be a mentor..."
                    />
                  </div>
                </div>
              </section>
              {/* Availability */}
              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Availability
                </h3>
                <div className="space-y-4">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 border border-blue-100 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            id={`enable-${day}`}
                            name={`enable-${day}`}
                            type="checkbox"
                            checked={weeklySchedule[day].enabled}
                            onChange={() => handleToggleDay(day)}
                            className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`enable-${day}`}
                            className="block text-base font-medium text-blue-900"
                          >
                            {day}
                          </label>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            weeklySchedule[day].enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {weeklySchedule[day].enabled
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>
                      {weeklySchedule[day].enabled && (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            {weeklySchedule[day].slots.map((slot, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1"
                              >
                                <TimeSlotDisplay
                                  start={slot.start}
                                  end={slot.end}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(day, idx)}
                                  className="text-red-400 hover:text-red-600 p-0.5"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500">
                                Start
                              </label>
                              <TimePicker
                                value={weeklySchedule[day].start}
                                onChange={(v) =>
                                  handleTimeChange(day, "start", v)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">
                                End
                              </label>
                              <TimePicker
                                value={weeklySchedule[day].end}
                                onChange={(v) => handleTimeChange(day, "end", v)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              className="mt-4"
                              onClick={() => handleAddTimeSlot(day)}
                            >
                              Add Slot
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
              {/* Submit */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-lg font-bold"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyMentor;