"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ISiteSettings } from "@/types";

export function AboutSection({ settings }: { settings: ISiteSettings }) {
  return (
    <section id="about" className="py-24 bg-accent/5 relative">
      <Container>
        <div className="max-w-4xl mx-auto">
          <NeonHeading>About Me</NeonHeading>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center space-y-6"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {settings?.ownerBio || "I am a dedicated developer focused on building professional grade digital solutions."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
                <h4 className="text-foreground font-bold text-lg mb-2">Education</h4>
                <p className="text-muted-foreground text-sm">Diploma in CSE & B.Tech Student</p>
              </div>
              <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
                <h4 className="text-foreground font-bold text-lg mb-2">Experience</h4>
                <p className="text-muted-foreground text-sm">Freelance & Open Source Contributor</p>
              </div>
              <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
                <h4 className="text-foreground font-bold text-lg mb-2">Goal</h4>
                <p className="text-muted-foreground text-sm">Scale high-impact engineering solutions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
