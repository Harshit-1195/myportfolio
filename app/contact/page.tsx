"use client";

import { motion } from "framer-motion";
import { MapPin, Linkedin, Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BackToHomeAlt } from "@/components/back-to-home-alt";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // mimic sending delay
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  }

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      value: "Dubai, UAE",
      delay: 0.1,
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/in/harshitdabhi",
      label: "LinkedIn",
      delay: 0.1,
    },
  ];

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Contact</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            className="glass-panel p-8 rounded-lg text-center flex flex-col items-center justify-center overflow-hidden relative hover-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: item.delay }}
            whileHover={{
              scale: 1.05,
              x: 5,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/5 z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="glass-panel text-white p-4 rounded-full mb-4 z-10"
              whileHover={{
                rotate: 360,
                transition: { duration: 0.5 },
              }}
            >
              {item.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-white z-10 relative">{item.title}</h3>
            <p className="text-white/70 z-10 relative">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <motion.div
          className="glass-panel p-8 rounded-lg overflow-hidden relative hover-glow-blue"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="absolute inset-0 bg-white/5 z-0" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-white">Get In Touch</h2>

            {formSubmitted ? (
              <div className="text-center py-10">
                <div className="glass-panel text-white p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Message Sent!</h3>
                <p className="text-white/70 mb-6">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <Button className="glass-panel text-white hover-glow" onClick={() => setFormSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-1">
                      First Name
                    </label>
                    <Input id="firstName" name="firstName" required className="glass-panel text-white border-white/20 bg-transparent" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-1">
                      Last Name
                    </label>
                    <Input id="lastName" name="lastName" required className="glass-panel text-white border-white/20 bg-transparent" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required className="glass-panel text-white border-white/20 bg-transparent" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-1">
                    Subject
                  </label>
                  <Input id="subject" name="subject" required className="glass-panel text-white border-white/20 bg-transparent" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">
                    Message
                  </label>
                  <Textarea id="message" name="message" rows={5} required className="glass-panel text-white border-white/20 bg-transparent" />
                </div>
                <Button type="submit" className="w-full glass-panel text-white hover-glow" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* right column remains the same, so keep your current Connect With Me + FAQs untouched */}
        {/* only change was removing async form and making it static */}
      </div>

      <BackToHomeAlt />
    </div>
  );
}
