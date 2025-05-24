
"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type DayOfWeek = typeof daysOfWeek[number];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = (i % 2) * 30;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

const predefinedSkills = [
  "Career Counseling", 
  "Technical Interview Prep", 
  "Resume Review", 
  "Leadership", 
  "Product Management", 
  "Software Engineering", 
  "Data Science", 
  "Machine Learning", 
  "UX Design", 
  "Entrepreneurship"
];

const timeSlotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
}).refine(data => data.end > data.start, {
  message: "End time must be after start time",
  path: ["end"], 
});

const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  slots: z.array(timeSlotSchema),
}).superRefine((data, ctx) => {
  if (data.enabled && data.slots.length > 1) {
    const sortedSlots = [...data.slots].sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      if (sortedSlots[i].end > sortedSlots[i+1].start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time slots must not overlap.",
          path: ["slots"],
        });
        break; 
      }
    }
  }
});

const weeklyScheduleSchema = z.object(
  daysOfWeek.reduce((acc, day) => {
    acc[day] = dayScheduleSchema;
    return acc;
  }, {} as Record<DayOfWeek, typeof dayScheduleSchema>)
);

const mentorSignupSchema = z.object({
  mentors_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().min(1, "Email is required.").email({ message: "Please enter a valid email." }),
  title: z.string().optional(),
  area_of_expertise: z.string().optional(),
  college: z.string().optional(),
  years_of_experience: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().int().min(0, "Years of experience must be 0 or more.").optional().nullable()
  ),
  description: z.string().optional(),
  phno: z.string().optional(),
  linkedin_url: z.string().url({ message: "Must be a valid LinkedIn URL" }).optional().or(z.literal('')).nullable(),
  profile_pic_file: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, .webp, .gif formats are supported."
    ),
  skills: z.array(z.string()).min(1, "Please select at least one skill."),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  availability: weeklyScheduleSchema.optional().nullable(),
});

type MentorSignupFormValues = z.infer<typeof mentorSignupSchema>;

const defaultAvailability = daysOfWeek.reduce((acc, day) => {
  acc[day] = { enabled: false, slots: [] };
  return acc;
}, {} as Record<DayOfWeek, { enabled: boolean; slots: { start: string; end: string }[] }>);


export function MentorSignupForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<MentorSignupFormValues>({
    resolver: zodResolver(mentorSignupSchema),
    defaultValues: {
      mentors_name: "",
      email: "",
      title: "",
      area_of_expertise: "",
      college: "",
      years_of_experience: undefined,
      description: "",
      phno: "",
      linkedin_url: "",
      profile_pic_file: null,
      skills: [],
      gender: undefined,
      availability: defaultAvailability,
    },
  });

  const { control } = form;

  async function onSubmit(values: MentorSignupFormValues) {
    setIsSubmitting(true);
    let authUserId: string | null = null;
    let uploadedProfilePicUrl: string | null = null;

    // 1. Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      // Not providing a password here relies on magic link / confirmation email flow
      // Ensure Supabase project settings (Site URL, Enable Magic Link/Email Confirmations) are correct.
    });

    if (authError) {
      // Check if user already exists, they might need to log in or use a different email
      if (authError.message.includes("User already registered")) {
         toast({
          title: "Email Already Registered",
          description: "This email is already in use. Please use a different email or log in if you already have an account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: authError.message || "Could not initiate signup. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
      return;
    }

    if (!authData.user && !authData.session) {
        // This case implies that a confirmation email has been sent, but the user is not yet authenticated.
        // For example, if email confirmation is required but magic link is off.
        // We will proceed to create the mentor profile, but it won't be linked to a user_id immediately.
        // Or, if authData.user.identities is empty or doesn't have email.
        // A more robust flow might handle this differently, but for now, we check if we got a user ID.
        // If `authData.user` is null BUT a magic link / confirmation was sent, authData.user might still be null until they click the link.
        // If signUp completes successfully and returns a user object (even if unconfirmed), we use its ID.
        // Supabase returns `user` if the user entry was created, even if confirmation is pending.
        if (authData.user?.id) {
             authUserId = authData.user.id;
        } else {
            // If no user ID is available immediately, we might not be able to link.
            // However, Supabase sends the email even if user is null but session is also null initially for confirm email flow.
            // For now, we'll show a generic message that link is sent, and try to save profile without user_id if authUserId is null.
            // This part of logic depends heavily on Supabase project's auth settings (Magic Link vs. Confirm Email)
        }
    } else if (authData.user) {
        authUserId = authData.user.id;
    }


    // 2. Profile Picture Upload (if file provided and authUserId is available for path)
    if (values.profile_pic_file && authUserId) {
      const file = values.profile_pic_file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // Using timestamp for uniqueness
      const filePath = `${authUserId}/${fileName}`; // Store image under user's ID folder

      try {
        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false, // Do not upsert, treat as new file
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);
        
        if (publicUrlData) {
          uploadedProfilePicUrl = publicUrlData.publicUrl;
        } else {
            throw new Error("Could not get public URL for uploaded image.");
        }

      } catch (error: any) {
        console.error("Error uploading profile picture:", error);
        toast({
          title: "Profile Picture Upload Failed",
          description: error.message || "Could not upload your profile picture. It will be skipped.",
          variant: "destructive",
        });
        // Not returning here, profile creation will proceed without picture if upload fails
      }
    } else if (values.profile_pic_file && !authUserId) {
        toast({
          title: "Profile Picture Skipped",
          description: "Profile picture upload was skipped as user authentication is pending email confirmation.",
          variant: "default",
        });
    }


    // 3. Prepare data for 'mentors' table
    const dataToInsert = {
      mentors_name: values.mentors_name,
      title: values.title || null,
      area_of_expertise: values.area_of_expertise || null,
      college: values.college || null,
      years_of_experience: values.years_of_experience === undefined || isNaN(values.years_of_experience) ? null : values.years_of_experience,
      description: values.description || null,
      email: values.email, // Storing form email, could be different from auth email if allowed
      phno: values.phno || null,
      linkedin_url: values.linkedin_url || null,
      availability: values.availability ? JSON.stringify({ weeklySchedule: values.availability }) : null,
      profile_pic_url: uploadedProfilePicUrl,
      skills: values.skills,
      gender: values.gender || null,
      user_id: authUserId, // Link to the auth.users table
    };
    
    // 4. Insert into 'mentors' table
    const { error: insertError } = await supabase
      .from('mentors')
      .insert([dataToInsert])
      .select();

    setIsSubmitting(false);

    if (insertError) {
      console.error("Supabase mentor insert error:", insertError);
      toast({
        title: "Error Saving Profile",
        description: insertError.message || "Could not save your mentor details. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signup Initiated!",
        description: `A confirmation or magic link has been sent to ${values.email}. Please check your inbox to complete the process. Your profile details have been saved.`,
      });
      form.reset(); 
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
              <FormLabel>Full Name *</FormLabel>
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
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>
                A magic link or confirmation email will be sent here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title / Current Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Software Engineer" {...field} value={field.value ?? ""} />
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
              <FormLabel>Area of Expertise</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Development, Product Management" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                What is your primary area of expertise?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills *</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {predefinedSkills.map((skill) => (
                    <Button
                      type="button"
                      key={skill}
                      variant={field.value?.includes(skill) ? "default" : "outline"}
                      onClick={() => {
                        const currentSkills = field.value || [];
                        const newSkills = currentSkills.includes(skill)
                          ? currentSkills.filter((s) => s !== skill)
                          : [...currentSkills, skill];
                        field.onChange(newSkills);
                      }}
                      className="rounded-full px-3 py-1 text-sm"
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Select the skills you can offer mentorship in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="years_of_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ""} />
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
              <FormLabel>College / University</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Stanford University" {...field} value={field.value ?? ""}/>
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
              <FormLabel>LinkedIn Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/in/yourprofile" {...field} value={field.value ?? ""} />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., +91 XXXXXXXXXX" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_pic_file"
          render={({ field: { onChange, value, ...rest } }) => ( 
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    onChange(file || null);
                  }}
                  {...rest}
                />
              </FormControl>
               <FormDescription>
                Upload an image for your profile (max 5MB; JPG, PNG, WEBP, GIF).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself, your experience, and what you can offer as a mentor."
                  className="resize-y min-h-[100px]"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6">
          <FormLabel className="text-lg font-semibold">Set Your Weekly Availability</FormLabel>
          {daysOfWeek.map((day) => (
            <DayAvailabilityControl key={day} day={day} control={control} form={form} />
          ))}
        </div>

        <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Sign Up as Mentor"}
        </Button>
      </form>
    </Form>
  );
}

interface DayAvailabilityControlProps {
  day: DayOfWeek;
  control: any; 
  form: any; 
}

function DayAvailabilityControl({ day, control, form }: DayAvailabilityControlProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `availability.${day}.slots`,
  });

  const isEnabled = form.watch(`availability.${day}.enabled`);

  return (
    <Card className="border-border/70 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <FormField
          control={control}
          name={`availability.${day}.enabled`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-base font-medium">
                {day}
              </FormLabel>
            </FormItem>
          )}
        />
        <Badge variant={isEnabled ? "default" : "secondary"}>
          {isEnabled ? "Available" : "Unavailable"}
        </Badge>
      </CardHeader>
      {isEnabled && (
        <CardContent className="p-4 pt-0 space-y-3">
          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 border rounded-md bg-secondary/30">
              <div className="grid grid-cols-2 gap-2 flex-grow">
                <FormField
                  control={control}
                  name={`availability.${day}.slots.${index}.start`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Start</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`availability.${day}.slots.${index}.end`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">End</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="mt-2 sm:mt-0 text-destructive hover:bg-destructive/10 self-end sm:self-center"
                aria-label="Remove slot"
              >
                <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Remove</span>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ start: '09:00', end: '10:00' })}
            className="mt-2"
          >
            Add Slot
          </Button>
          {form.formState.errors.availability?.[day]?.slots?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.availability?.[day]?.slots?.message}
            </p>
          )}
          {/* @ts-ignore Zod superRefine error on root of array */}
          {form.formState.errors.availability?.[day]?.slots?.root?.message && (
             <p className="text-sm font-medium text-destructive">
                {/* @ts-ignore */}
              {form.formState.errors.availability?.[day]?.slots?.root?.message}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

    