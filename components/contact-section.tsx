"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedText from "@/components/animated-text";

export default function ContactSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-20 px-4 md:px-10 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-black/5 -z-10"
        animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-black/5 -z-10"
        animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Get In Touch"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            speed={80}
          />

          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Looking for a digital marketing professional with expertise in programmatic advertising and media buying?
            I'd love to discuss how I can help elevate your marketing strategy.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="bg-gray-50 p-8 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div className="flex items-start" variants={item}>
                <motion.div
                  className="bg-black text-white p-3 rounded-full mr-4"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <MapPin className="h-5 w-5" />
                </motion.div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-muted-foreground">Dubai, UAE</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4">Follow Me</h3>
              <div className="flex gap-4">
                <motion.a
                  href="https://linkedin.com/in/harshitdabhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Call-to-Actions */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6">Have a Project in Mind?</h3>

            <p className="text-muted-foreground mb-8">
              I specialize in programmatic advertising, media buying, and performance marketing. Whether you need help
              with campaign optimization, audience targeting, or developing a comprehensive digital strategy, I'm here
              to help you achieve exceptional results.
            </p>

            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => window.open("https://calendly.com/harshitdabhi/30min", "_blank")}
                  className="w-full bg-black text-white hover:bg-black/80 flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule a Meeting
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => (window.location.href = "/contact")}
                  className="w-full bg-black text-white hover:bg-black/80 flex items-center justify-center gap-2"
                >
                  Contact Form
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
