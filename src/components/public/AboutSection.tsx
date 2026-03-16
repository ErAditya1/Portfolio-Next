"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ISiteSettings } from "@/types";

export function AboutSection({ settings }: { settings: ISiteSettings }) {
  return (
    <section id="about" className="py-24 bg-black/20 relative">
      <Container>
        <div className="max-w-4xl mx-auto">
          <NeonHeading>About Me</NeonHeading>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center space-y-6"
          >
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              {settings?.ownerBio || "I am a dedicated developer focused on building professional grade digital solutions."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-2">Education</h4>
                <p className="text-gray-400 text-sm">Diploma in CSE & B.Tech Student</p>
              </div>
              <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-2">Experience</h4>
                <p className="text-gray-400 text-sm">Freelance & Open Source Contributor</p>
              </div>
              <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-2">Goal</h4>
                <p className="text-gray-400 text-sm">Scale high-impact engineering solutions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
