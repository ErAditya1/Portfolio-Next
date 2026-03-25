"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { Layout, Server, Shield, Smartphone, PenTool, Globe } from "lucide-react";

const services = [
  { title: "Web Architecture", icon: Layout, desc: "Building scalable and performant full-stack web applications with modern frameworks.", color: "text-blue-400" },
  { title: "Backend Engineering", icon: Server, desc: "Designing robust APIs and microservices with secure database integrations.", color: "text-purple-400" },
  { title: "Mobile Dev", icon: Smartphone, desc: "Crafting seamless mobile experiences using React Native and Flutter.", color: "text-pink-400" },
  { title: "Cybersecurity", icon: Shield, desc: "Implementing advanced security protocols and conducting practical vulnerability research.", color: "text-emerald-400" },
  { title: "UI/UX Design", icon: PenTool, desc: "Fusing aesthetics with functionality to create intuitive user journeys.", color: "text-yellow-400" },
  { title: "DevOps & Cloud", icon: Globe, desc: "Automating deployments and managing cloud infrastructure for high-availability systems.", color: "text-cyan-400" },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-accent/5 relative">
      <Container>
        <NeonHeading>Expertise</NeonHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 glass rounded-3xl hover:border-primary/50 transition-all group shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${s.color}`}>
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="text-foreground font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
