
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Check, Loader2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${String(hours).padStart(2, "0")}:${minutes}`;
});

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const slotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
}).refine(data => data.start < data.end, {
  message: "End time must be after start time",
  path: ["end"],
});

const daySchema = z.object({
  enabled: z.boolean(),
  slots: z.array(slotSchema),
});

const weeklyScheduleSchema = z.object(
  Object.fromEntries(daysOfWeek.map(day => [day, daySchema])) as Record<typeof daysOfWeek[number], typeof daySchema>
).refine(schedule => {
  for (const day of daysOfWeek) {
    const daySchedule = schedule[day];
    if (daySchedule.enabled) {
      for (let i = 0; i < daySchedule.slots.length; i++) {
        for (let j = i + 1; j < daySchedule.slots.length; j++) {
          const slotA = daySchedule.slots[i];
          const slotB = daySchedule.slots[j];
          if (Math.max(parseInt(slotA.start.replace(":", "")), parseInt(slotB.start.replace(":", ""))) < Math.min(parseInt(slotA.end.replace(":", "")), parseInt(slotB.end.replace(":", "")))) {
            // Do not call toast directly in refine, as it's a validation function.
            // Return false to indicate validation failure. The message here can be generic.
            // Specific toast messages can be handled in the onSubmit handler if needed.
            return false; // Overlapping slots
          }
        }
      }
    }
  }
  return true;
}, { message: "Time slots within the same day cannot overlap. Please correct." });


const predefinedSkills = [
  "Software Development", "Project Management", "Marketing", "Sales", "Data Science",
  "Product Management", "UX/UI Design", "DevOps", "Cybersecurity", "AI/Machine Learning",
  "Business Strategy", "Finance", "Human Resources", "Content Creation", "Public Speaking"
];

const mentorSignupSchema = z.object({
  mentors_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  area_of_expertise: z.string().min(3, { message: "Area of expertise is required." }),
  college: z.string().optional(),
  years_of_experience: z.coerce.number().int().min(0, "Years of experience cannot be negative.").optional().or(z.literal("")),
  description: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  phno: z.string().optional(),
  linkedin_url: z.string().url({ message: "Invalid LinkedIn URL." }).optional().or(z.literal("")),
  skills: z.array(z.string()).min(1, { message: "Please select at least one skill." }),
  profile_pic_file: z
    .instanceof(File, { message: "Profile picture is required." })
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, .webp and .gif formats are accepted."),
  availability: weeklyScheduleSchema,
});

type MentorSignupFormValues = z.infer<typeof mentorSignupSchema>;

const defaultAvailability = Object.fromEntries(
  daysOfWeek.map(day => [day, { enabled: false, slots: [] }])
) as Record<typeof daysOfWeek[number], { enabled: boolean; slots: { start: string; end: string }[] }>;


export function MentorSignupForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<MentorSignupFormValues>({
    resolver: zodResolver(mentorSignupSchema),
    defaultValues: {
      mentors_name: "",
      title: "",
      area_of_expertise: "",
      college: "",
      years_of_experience: undefined,
      description: "",
      email: "",
      phno: "",
      linkedin_url: "",
      skills: [],
      profile_pic_file: undefined,
      availability: defaultAvailability,
    },
  });

  const { fields: mondayFields, append: appendMonday, remove: removeMonday } = useFieldArray({ control: form.control, name: "availability.Monday.slots" });
  const { fields: tuesdayFields, append: appendTuesday, remove: removeTuesday } = useFieldArray({ control: form.control, name: "availability.Tuesday.slots" });
  const { fields: wednesdayFields, append: appendWednesday, remove: removeWednesday } = useFieldArray({ control: form.control, name: "availability.Wednesday.slots" });
  const { fields: thursdayFields, append: appendThursday, remove: removeThursday } = useFieldArray({ control: form.control, name: "availability.Thursday.slots" });
  const { fields: fridayFields, append: appendFriday, remove: removeFriday } = useFieldArray({ control: form.control, name: "availability.Friday.slots" });
  const { fields: saturdayFields, append: appendSaturday, remove: removeSaturday } = useFieldArray({ control: form.control, name: "availability.Saturday.slots" });
  const { fields: sundayFields, append: appendSunday, remove: removeSunday } = useFieldArray({ control: form.control, name: "availability.Sunday.slots" });

  const dayFieldArrays = {
    Monday: { fields: mondayFields, append: appendMonday, remove: removeMonday },
    Tuesday: { fields: tuesdayFields, append: appendTuesday, remove: removeTuesday },
    Wednesday: { fields: wednesdayFields, append: appendWednesday, remove: removeWednesday },
    Thursday: { fields: thursdayFields, append: appendThursday, remove: removeThursday },
    Friday: { fields: fridayFields, append: appendFriday, remove: removeFriday },
    Saturday: { fields: saturdayFields, append: appendSaturday, remove: removeSaturday },
    Sunday: { fields: sundayFields, append: appendSunday, remove: removeSunday },
  };


  async function onSubmit(data: MentorSignupFormValues) {
    setIsSubmitting(true);
    let authUserId: string | null = null;
    let authErrorOccurred = false;
    let authErrorMessage = "Could not initiate sign up. Please try again.";

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined, 
        },
      });

      if (authError) {
        console.error("Supabase Auth Error (signInWithOtp):", JSON.stringify(authError, null, 2));
        authErrorOccurred = true;
        authErrorMessage = authError.message || authErrorMessage;
        
        // If it's an unexpected_failure, we'll log it and proceed, 
        // but the user won't have an auth.users entry created for this attempt.
        if (authError.status === 500 && (authError as any).code === "unexpected_failure") {
           console.warn("Supabase returned 'unexpected_failure' during OTP sign-in. Proceeding with profile save attempt.");
           toast({
            variant: "destructive",
            title: "Authentication Issue (OTP)",
            description: "There was an unexpected issue sending the confirmation email. Your profile will still be saved.",
          });
        } else {
           toast({ // For other auth errors
            variant: "destructive",
            title: "Authentication Failed (OTP)",
            description: authErrorMessage,
          });
          // For general auth errors (not unexpected_failure), we might reconsider proceeding,
          // but current logic is to proceed with profile save.
        }
      } else if (authData?.user) {
        authUserId = authData.user.id;
        toast({
          title: "Confirmation Email Sent",
          description: "Please check your email for a confirmation link to complete your signup.",
        });
      } else if (authData && !authData.user && authData.session === null){
         // This case means OTP sent, user may or may not exist yet.
         toast({
          title: "Confirmation Email Sent",
          description: "Please check your email for a link to complete your signup.",
        });
      }


      let publicProfilePicUrl: string | undefined = undefined;
      if (data.profile_pic_file) {
        const file = data.profile_pic_file;
        const fileName = `${authUserId || 'unverified_user'}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Supabase profile picture upload error:", uploadError);
          toast({
            variant: "destructive",
            title: "Profile Picture Upload Failed",
            description: uploadError.message,
          });
          // Continue without profile pic if upload fails
        } else if (uploadData?.path) {
          const { data: urlData } = supabase.storage.from("profile-pictures").getPublicUrl(uploadData.path);
          publicProfilePicUrl = urlData?.publicUrl;
        }
      }

      const { profile_pic_file, ...restOfData } = data;
      const mentorDataToSave = {
        ...restOfData,
        user_id: authUserId, 
        profile_pic_url: publicProfilePicUrl,
        years_of_experience: typeof data.years_of_experience === 'number' ? data.years_of_experience : null,
        availability: JSON.stringify({ weeklySchedule: data.availability }) // Ensure data is stringified
      };

      const { error: insertError } = await supabase
        .from("mentors")
        .insert([mentorDataToSave]);

      if (insertError) {
        console.error("Supabase mentor insert error object:", JSON.stringify(insertError, null, 2));
        toast({
          variant: "destructive",
          title: "Profile Saving Failed",
          description: `Database error: ${insertError.message}. Please try again.`,
        });
      } else {
        if (authErrorOccurred && authError?.status === 500 && (authError as any).code === "unexpected_failure") {
             toast({
                title: "Profile Saved (Auth Issue)",
                description: "Your mentor profile was saved, but there was an issue sending the confirmation email. Please check your email or try logging in later.",
            });
        } else if (authErrorOccurred) { // Other auth errors, but profile saved
             toast({
                title: "Profile Saved (Auth Failed)",
                description: `Your mentor profile was saved, but authentication failed: ${authErrorMessage}`,
            });
        } else { // Auth succeeded (OTP sent) and profile saved
            toast({
                title: "Profile Saved & Confirmation Sent!",
                description: "Your mentor profile has been submitted. Please check your email for a confirmation link.",
            });
        }
        localStorage.setItem('careerDiveMentorEmail', data.email);
        // Redirect to mentor dashboard
        if (typeof window !== "undefined") {
          window.location.href = 'https://mentor-dashboard.netlify.app/auth';
        }
      }

    } catch (error: any) {
      console.error("Unexpected error during signup:", error);
      toast({
        variant: "destructive",
        title: "An Unexpected Error Occurred",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mentors_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Title/Profession</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area_of_expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Area of Expertise</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Development, Product Management" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormDescription>Select skills you can mentor in.</FormDescription>
              <Controller
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {predefinedSkills.map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant={field.value?.includes(skill) ? "default" : "outline"}
                        onClick={() => {
                          const currentSkills = field.value || [];
                          const newSkills = currentSkills.includes(skill)
                            ? currentSkills.filter((s) => s !== skill)
                            : [...currentSkills, skill];
                          field.onChange(newSkills);
                        }}
                      >
                        {field.value?.includes(skill) && <Check className="mr-2 h-4 w-4" />}
                        {skill}
                      </Button>
                    ))}
                  </div>
                )}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="years_of_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Professional Experience (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College/University (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Stanford University" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://linkedin.com/in/janedoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., +1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio/Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about your experience and what you can offer as a mentor."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_pic_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                />
              </FormControl>
              <FormDescription>Max 5MB. Recommended formats: JPG, PNG, GIF, WEBP.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Set Your Weekly Availability</h3>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-4 border rounded-md space-y-3 bg-card">
              <FormField
                control={form.control}
                name={`availability.${day}.enabled`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <FormLabel className="text-base">{day}</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch(`availability.${day}.enabled`) && (
                <div className="space-y-2">
                  {dayFieldArrays[day].fields.map((slot, index) => (
                    <div key={slot.id} className="flex items-end gap-2 p-2 border rounded-md">
                      <FormField
                        control={form.control}
                        name={`availability.${day}.slots.${index}.start`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Start Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select start time" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeOptions.map(time => <SelectItem key={`start-${day}-${index}-${time}`} value={time}>{time}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`availability.${day}.slots.${index}.end`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>End Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select end time" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeOptions.map(time => <SelectItem key={`end-${day}-${index}-${time}`} value={time}>{time}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => dayFieldArrays[day].remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => dayFieldArrays[day].append({ start: "09:00", end: "10:00" })}>
                    Add Time Slot
                  </Button>
                   <FormMessage>
                    {form.formState.errors.availability?.[day]?.slots?.message}
                  </FormMessage>
                </div>
              )}
            </div>
          ))}
           <FormMessage>
            {form.formState.errors.availability?.root?.message}
            </FormMessage>
        </div>


        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up as Mentor
        </Button>
      </form>
    </Form>
  );
}
