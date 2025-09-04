"use client";

import { Container } from "@/components/Container";
import { EMAIL } from "@/Data";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-[#0f172a]/50 via-[#1e1b4b]/40 to-[#020617]/50">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r h-14 from-cyan-400 via-fuchsia-400 to-indigo-500">
            Let’s Work Together
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            I’m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 p-6 rounded-2xl border border-white/6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `mailto:${EMAIL}`;
            }}
          >
            <input
              className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white"
              placeholder="Your name"
              required
            />
            <input
              className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white"
              type="email"
              placeholder="Email"
              required
            />
            <input
              className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white"
              placeholder="Subject"
            />
            <textarea
              className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white"
              rows={5}
              placeholder="Message"
            />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold">
              Send message
            </button>
          </motion.form>

          {/* Contact Info + Socials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8 gap-4 flex flex-col"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Contact Info
              </h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  mradityaji2@gmail.com
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  +91 9473774390
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Lucknow, Uttar Pradesh, India
                </li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Connect with Me
              </h2>
              <div className="flex gap-4">
                <a
                  href="https://github.com/aditya"
                  target="_blank"
                  className="p-3 rounded-full bg-white/10 border border-white/10 hover:bg-cyan-500/20 transition"
                >
                  <Github className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://linkedin.com/in/aditya"
                  target="_blank"
                  className="p-3 rounded-full bg-white/10 border border-white/10 hover:bg-indigo-500/20 transition"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">FAQ</h2>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>✔ Available for freelance and full-time roles</li>
                <li>✔ Open to remote & on-site opportunities</li>
                <li>✔ Usually replies within 24 hours</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
