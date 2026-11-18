"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectType: "Full Stack Web App / SaaS",
      budget: "$1,500 – $5,000",
    },
  });

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const subjectParam = searchParams.get("subject");
    if (serviceParam) {
      setValue("subject", `Inquiry regarding: ${serviceParam}`);
      setValue("projectType", "Full Stack Web App / SaaS");
    } else if (subjectParam) {
      setValue("subject", subjectParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message received! I'll get back to you within 24 hours.");
        setSubmitted(true);
        reset();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to send message. Please try email directly.");
      }
    } catch (e) {
      toast.error("Network error. Please try reaching out directly via email.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-8 p-10 rounded-[2.5rem] bg-card border border-emerald-500/30 text-center space-y-5 shadow-xl"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
          Thank you for reaching out. Your inquiry has been logged in my database and sent to my email inbox. I will review your requirements and respond within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 rounded-2xl bg-accent border border-border text-xs font-bold text-foreground hover:bg-accent/80 transition-all"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-8"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 space-y-7 backdrop-blur-md shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-name"
              {...register("name")}
              placeholder="e.g. Sarah Jenkins"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full bg-accent/40 border border-border rounded-2xl px-5 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-sm"
            />
            {errors.name && (
              <p id="name-error" role="alert" className="text-destructive text-[11px] font-bold mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-email"
              {...register("email")}
              type="email"
              placeholder="e.g. sarah@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full bg-accent/40 border border-border rounded-2xl px-5 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-sm"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-destructive text-[11px] font-bold mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Type */}
          <div className="space-y-2">
            <label htmlFor="contact-project-type" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Inquiry / Project Type
            </label>
            <select
              id="contact-project-type"
              {...register("projectType")}
              className="w-full bg-accent/40 border border-border rounded-2xl px-5 py-3.5 text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-sm"
            >
              <option value="Full Stack Web App / SaaS">Full Stack Web App / SaaS Platform</option>
              <option value="AI Voice & Telephony">AI Voice & Telephony Systems</option>
              <option value="Backend APIs & Architecture">Backend APIs & Architecture</option>
              <option value="Full-Time Engineering Role">Full-Time Engineering Role / Interview</option>
              <option value="Technical Consulting / Other">Technical Consulting / Other</option>
            </select>
          </div>

          {/* Budget Range (Optional) */}
          <div className="space-y-2">
            <label htmlFor="contact-budget" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Estimated Budget (Optional)
            </label>
            <select
              id="contact-budget"
              {...register("budget")}
              className="w-full bg-accent/40 border border-border rounded-2xl px-5 py-3.5 text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-sm"
            >
              <option value="< $500">&lt; $500 (₹35,000)</option>
              <option value="$500 – $1,500">$500 – $1,500 (₹35k – ₹1.2L)</option>
              <option value="$1,500 – $5,000">$1,500 – $5,000 (₹1.2L – ₹4L)</option>
              <option value="$5,000+">$5,000+ (₹4L+)</option>
              <option value="Full-Time Employment">Full-Time Role / Fixed Salary</option>
            </select>
          </div>
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <label htmlFor="contact-subject" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Subject (Optional)
          </label>
          <input
            id="contact-subject"
            {...register("subject")}
            placeholder="e.g. Next.js SaaS Platform Development"
            className="w-full bg-accent/40 border border-border rounded-2xl px-5 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium text-sm"
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Project Description & Requirements <span className="text-destructive">*</span>
          </label>
          <textarea
            id="contact-message"
            {...register("message")}
            rows={5}
            placeholder="Briefly describe what you are looking to build, existing systems, or role requirements..."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="w-full bg-accent/40 border border-border rounded-2xl px-5 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none font-medium text-sm"
          />
          {errors.message && (
            <p id="message-error" role="alert" className="text-destructive text-[11px] font-bold mt-1 ml-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-xs shadow-lg shadow-indigo-500/25"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitting ? "Transmitting..." : (
              <>
                <span>Send Inquiry / Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}
