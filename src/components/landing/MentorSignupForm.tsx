
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { supabase } from '@/lib/supabaseClient'; // Use the configured Supabase client
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const mentorSignupSchema = z.object({
  mentors_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().optional(),
  area_of_expertise: z.string().optional(),
  college: z.string().optional(),
  years_of_experience: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().int().min(0, "Years of experience must be 0 or more.").optional().nullable()
  ),
  description: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')).nullable(),
  phno: z.string().optional(),
  linkedin_url: z.string().url({ message: "Must be a valid LinkedIn URL" }).optional().or(z.literal('')).nullable(),
  availability: z.string().optional(),
  availability_status: z.enum(['Available', 'Unavailable', 'Limited']).default('Available'),
  profile_pic_file: z
    .instanceof(File, { message: "Profile picture is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, .webp, .gif formats are supported."
    ).optional().nullable(),
  skills: z.string().optional().describe("Enter skills separated by commas (e.g., JavaScript, React, Node.js)"),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
});

type MentorSignupFormValues = z.infer<typeof mentorSignupSchema>;

export function MentorSignupForm() {
  const { toast } = useToast();
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
      availability: "",
      availability_status: "Available",
      profile_pic_file: undefined,
      skills: "",
      gender: undefined,
    },
  });

  async function onSubmit(values: MentorSignupFormValues) {
    setIsSubmitting(true);
    let uploadedProfilePicUrl: string | null = null;

    if (values.profile_pic_file) {
      const file = values.profile_pic_file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
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
          description: error.message || "Could not upload your profile picture. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const dataToInsert = {
      mentors_name: values.mentors_name,
      title: values.title || null,
      area_of_expertise: values.area_of_expertise || null,
      college: values.college || null,
      years_of_experience: values.years_of_experience === undefined || isNaN(values.years_of_experience) ? null : values.years_of_experience,
      description: values.description || null,
      email: values.email || null,
      phno: values.phno || null,
      linkedin_url: values.linkedin_url || null,
      availability: values.availability || null,
      availability_status: values.availability_status,
      profile_pic_url: uploadedProfilePicUrl, // Use the uploaded file's URL
      skills: values.skills ? values.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : null,
      gender: values.gender || null,
    };
    
    const { data, error: insertError } = await supabase
      .from('mentors')
      .insert([dataToInsert])
      .select();

    setIsSubmitting(false);

    if (insertError) {
      console.error("Supabase error:", insertError);
      toast({
        title: "Error Signing Up",
        description: insertError.message || "Could not save your details. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signup Successful!",
        description: "Welcome! Your mentor profile has been created.",
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} value={field.value ?? ""} />
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
                What are you skilled in?
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
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g., JavaScript, React, Python" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Enter skills separated by commas.
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
          render={({ field: { onChange, value, ...rest } }) => ( // Destructure `value` out so it's not passed to Input type="file"
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
                  {...rest} // `onBlur`, `ref` etc.
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
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Evenings on weekdays, Flexible on weekends. Preferred contact method."
                  className="resize-y"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="availability_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                    <SelectItem value="Limited">Limited Availability</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Sign Up as Mentor"}
        </Button>
      </form>
    </Form>
  );
}


    