"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);

    if (res.ok) {
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to send message");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-8"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 space-y-8 backdrop-blur-md shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
            <input
              {...register("name")}
              placeholder="e.g. John Doe"
              className="w-full bg-accent/50 border border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
            />
            {errors.name && <p className="text-destructive text-[10px] font-bold mt-1 ml-1 uppercase">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. john@example.com"
              className="w-full bg-accent/50 border border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
            />
            {errors.email && <p className="text-destructive text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone (Optional)</label>
            <input
              {...register("phone")}
              placeholder="+91 00000 00000"
              className="w-full bg-accent/50 border border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Subject</label>
            <input
              {...register("subject")}
              placeholder="e.g. Project Inquiry"
              className="w-full bg-accent/50 border border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
          <textarea
            {...register("message")}
            rows={6}
            placeholder="Describe your vision or inquiry..."
            className="w-full bg-accent/50 border border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none font-medium"
          />
          {errors.message && <p className="text-destructive text-[10px] font-bold mt-1 ml-1 uppercase">{errors.message.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full relative group overflow-hidden bg-primary text-primary-foreground font-black py-5 rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(99,102,241,0.2)] dark:shadow-[0_10px_30px_rgba(168,85,247,0.2)]"
        >
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-3 transition-colors">
            {submitting ? "Processing..." : (
              <>
                Deploy Message <Send className="w-4 h-4" />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}
