"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Linkedin, Calendar, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { submitContactForm } from "@/lib/actions"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await submitContactForm(formData)
      setFormSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      value: "+971556453208",
      action: "tel:+971556453208",
      delay: 0.1,
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: "dabhiharshit11@gmail.com",
      action: "mailto:dabhiharshit11@gmail.com",
      delay: 0.2,
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      value: "Dubai, UAE",
      action: "https://maps.google.com/?q=Dubai,UAE",
      delay: 0.3,
    },
  ]

  // Update the socialLinks array to remove Twitter and Instagram
  const socialLinks = [
    {
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/in/harshitdabhi",
      label: "LinkedIn",
      delay: 0.1,
    },
  ]

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Contact</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactInfo.map((item, index) => (
          <motion.a
            key={index}
            href={item.action}
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
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <motion.div
          className="glass-panel p-8 rounded-lg overflow-hidden relative hover-glow-blue"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white/5 z-0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-white">Get In Touch</h2>

            {formSubmitted ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
                <motion.div
                  className="glass-panel text-white p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Send className="h-6 w-6" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">Message Sent!</h3>
                <p className="text-white/70 mb-6">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <Button className="glass-panel text-white hover-glow" onClick={() => setFormSubmitted(false)}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-1">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      className="glass-panel text-white border-white/20 bg-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-1">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      className="glass-panel text-white border-white/20 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="glass-panel text-white border-white/20 bg-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    className="glass-panel text-white border-white/20 bg-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="glass-panel text-white border-white/20 bg-transparent"
                  />
                </div>
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="w-full glass-panel text-white hover-glow" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>

        <motion.div
          className="glass-panel p-8 rounded-lg overflow-hidden relative hover-glow-yellow"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white/5 z-0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-white">Connect With Me</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">Social Media</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel px-4 py-2 rounded-full text-white hover-glow-pink flex items-center gap-2 overflow-hidden relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: link.delay }}
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
                    <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="z-10">
                      {link.icon}
                    </motion.span>
                    <span className="z-10">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Schedule a Meeting</h3>
              <p className="text-white/70 mb-4">
                Book a time slot that works for you, and let's discuss how I can help with your digital marketing needs.
              </p>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  x: 5,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/5 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <Button
                  onClick={() => window.open("https://calendly.com/harshitdabhi/30min", "_blank")}
                  className="w-full glass-panel text-white hover-glow-yellow flex items-center justify-center gap-2 relative z-10"
                >
                  <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Calendar className="h-4 w-4" />
                  </motion.span>
                  <span>Schedule Now</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="glass-panel p-8 rounded-lg overflow-hidden relative hover-glow-pink"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        whileHover={{
          scale: 1.02,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
      >
        <motion.div
          className="absolute inset-0 bg-white/5 z-0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.5 }}
        />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What services do you offer?",
                answer:
                  "I specialize in programmatic advertising, media buying, performance marketing, and comprehensive digital marketing strategies tailored to your business goals.",
              },
              {
                question: "How do you charge for your services?",
                answer:
                  "My pricing is based on project scope, campaign duration, and budget requirements. I offer both project-based and retainer options to suit different needs.",
              },
              {
                question: "Do you work with clients internationally?",
                answer:
                  "Yes, I have experience working with clients across MENA, Asia, Russia, Americas, and Europe, managing global programmatic campaigns.",
              },
              {
                question: "What industries do you specialize in?",
                answer:
                  "I've worked across diverse industries including healthcare, luxury goods, travel, finance, and e-commerce, adapting strategies to each sector's unique requirements.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="glass-panel p-6 rounded-lg relative overflow-hidden hover-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
                <h3 className="text-lg font-semibold mb-2 text-white z-10 relative">{faq.question}</h3>
                <p className="text-white/70 z-10 relative">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
