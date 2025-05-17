"use client"

import { jsPDF } from "jspdf"
import pptxgen from "pptxgenjs"

export async function generatePDF() {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add content to the PDF
  doc.setFontSize(24)
  doc.text("Harshit Dabhi", 20, 20)

  doc.setFontSize(14)
  doc.text("Digital Marketing Professional, Strategist", 20, 30)

  doc.setFontSize(18)
  doc.text("About Me", 20, 50)

  doc.setFontSize(12)
  const aboutText =
    "I'm Harshit Dabhi, a Passionate digital marketing manager with over 8+ years of international experience. Thorough knowledge of digital marketing, analytical, and customer relationship management tools."
  const splitAbout = doc.splitTextToSize(aboutText, 170)
  doc.text(splitAbout, 20, 60)

  doc.setFontSize(18)
  doc.text("Experience", 20, 90)

  doc.setFontSize(14)
  doc.text("Performance & Programmatic Manager", 20, 100)
  doc.setFontSize(12)
  doc.text("Media Agency Group • 2024 - Present", 20, 110)
  doc.text("• Led digital marketing initiatives resulting in 45% growth", 20, 120)
  doc.text("• Managed global programmatic campaigns for major accounts", 20, 130)
  doc.text("• Engaged with major DSPs like DV360, TTD, Amazon", 20, 140)
  doc.text("• Generated an average 6:1 ROI across campaigns", 20, 150)

  doc.setFontSize(14)
  doc.text("Performance Marketing Manager", 20, 170)
  doc.setFontSize(12)
  doc.text("Vazir Group • 2023 - 2024", 20, 180)
  doc.text("• Led high-performing media buying campaigns", 20, 190)
  doc.text("• Achieved an 86% increase in click-through rate", 20, 200)
  doc.text("• Enhanced user experience through data analytics", 20, 210)

  doc.setFontSize(18)
  doc.text("Expertise", 20, 230)

  doc.setFontSize(12)
  doc.text("• Programmatic Advertising", 20, 240)
  doc.text("• Performance Marketing", 20, 250)
  doc.text("• Media Planning & Buying", 20, 260)
  doc.text("• PPC & Paid Media", 20, 270)

  doc.setFontSize(18)
  doc.text("Contact", 140, 230)

  doc.setFontSize(12)
  doc.text("Email: dabhiharshit11@gmail.com", 140, 240)
  doc.text("Phone: +971556453208", 140, 250)
  doc.text("Location: Dubai, UAE", 140, 260)

  // Add a footer
  doc.setFontSize(10)
  doc.text("Generated from Harshit Dabhi's Portfolio Website", 20, 280)

  // Save the PDF
  doc.save("harshit-dabhi-resume.pdf")
}

export async function generatePPT() {
  // Create a new presentation
  const pres = new pptxgen()

  // Set the presentation properties
  pres.layout = "LAYOUT_16x9"
  pres.title = "Harshit Dabhi - Portfolio"

  // Add a title slide
  const slide1 = pres.addSlide()
  slide1.background = { color: "000000" }

  // Add a gradient overlay
  slide1.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { type: "gradient", color1: "101010", color2: "000000", angle: 45 },
  })

  slide1.addText("Harshit Dabhi", {
    x: 1,
    y: 1,
    w: 10,
    h: 1.5,
    fontSize: 44,
    color: "FFFFFF",
    bold: true,
    align: "left",
  })

  slide1.addText("Digital Marketing Professional, Strategist", {
    x: 1,
    y: 2.5,
    w: 10,
    h: 0.5,
    fontSize: 24,
    color: "CCCCCC",
    align: "left",
  })

  slide1.addText("Performance & Programmatic Manager", {
    x: 1,
    y: 3.2,
    w: 10,
    h: 0.5,
    fontSize: 18,
    color: "999999",
    align: "left",
  })

  // Add an about slide
  const slide2 = pres.addSlide()
  slide2.background = { color: "000000" }

  // Add a gradient overlay
  slide2.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { type: "gradient", color1: "101010", color2: "000000", angle: 45 },
  })

  slide2.addText("About Me", {
    x: 1,
    y: 0.5,
    w: 10,
    h: 1,
    fontSize: 32,
    color: "FFFFFF",
    bold: true,
  })

  slide2.addText(
    "I'm Harshit Dabhi, a Performance & Programmatic Manager with over 8 years of experience in digital marketing and media buying. My expertise spans across programmatic advertising, performance marketing, and strategic campaign management for global brands.",
    {
      x: 1,
      y: 1.8,
      w: 10,
      h: 2,
      fontSize: 18,
      color: "CCCCCC",
      align: "left",
    },
  )

  slide2.addText(
    "Throughout my career, I've successfully managed campaigns across MENA, Asia, Russia, Americas, and Europe, collaborating with major DSPs like DV360, The Trade Desk, Amazon, and more.",
    {
      x: 1,
      y: 3.5,
      w: 10,
      h: 2,
      fontSize: 18,
      color: "CCCCCC",
      align: "left",
    },
  )

  // Add an experience slide
  const slide3 = pres.addSlide()
  slide3.background = { color: "000000" }

  // Add a gradient overlay
  slide3.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { type: "gradient", color1: "101010", color2: "000000", angle: 45 },
  })

  slide3.addText("Professional Experience", {
    x: 1,
    y: 0.5,
    w: 10,
    h: 1,
    fontSize: 32,
    color: "FFFFFF",
    bold: true,
  })

  // Experience 1
  slide3.addText("Performance & Programmatic Manager", {
    x: 1,
    y: 1.8,
    w: 10,
    h: 0.5,
    fontSize: 22,
    color: "FFFFFF",
    bold: true,
  })

  slide3.addText("Media Agency Group • 2024 - Present", {
    x: 1,
    y: 2.3,
    w: 10,
    h: 0.5,
    fontSize: 16,
    color: "CCCCCC",
  })

  slide3.addText(
    [
      { text: "• Managed global programmatic campaigns for major accounts" },
      { text: "• Engaged with major DSPs like DV360, TTD, Amazon" },
      { text: "• Generated an average 6:1 ROI across campaigns" },
      { text: "• Reduced dead inbound leads by 74% MoM" },
    ],
    {
      x: 1,
      y: 2.8,
      w: 10,
      h: 2,
      fontSize: 16,
      color: "CCCCCC",
      bullet: true,
    },
  )

  // Experience 2
  slide3.addText("Performance Marketing Manager", {
    x: 1,
    y: 4.5,
    w: 10,
    h: 0.5,
    fontSize: 22,
    color: "FFFFFF",
    bold: true,
  })

  slide3.addText("Vazir Group • 2023 - 2024", {
    x: 1,
    y: 5.0,
    w: 10,
    h: 0.5,
    fontSize: 16,
    color: "CCCCCC",
  })

  slide3.addText(
    [
      { text: "• Led high-performing media buying campaigns" },
      { text: "• Achieved an 86% increase in click-through rate" },
      { text: "• Enhanced user experience through data analytics" },
    ],
    {
      x: 1,
      y: 5.5,
      w: 10,
      h: 1.5,
      fontSize: 16,
      color: "CCCCCC",
      bullet: true,
    },
  )

  // Add an expertise slide
  const slide4 = pres.addSlide()
  slide4.background = { color: "000000" }

  // Add a gradient overlay
  slide4.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { type: "gradient", color1: "101010", color2: "000000", angle: 45 },
  })

  slide4.addText("My Expertise", {
    x: 1,
    y: 0.5,
    w: 10,
    h: 1,
    fontSize: 32,
    color: "FFFFFF",
    bold: true,
  })

  // Create a 2x3 grid for expertise areas
  const expertiseAreas = [
    "Programmatic Advertising",
    "Performance Marketing",
    "Media Planning & Buying",
    "PPC & Paid Media",
    "Analytics & Reporting",
    "Budget Management",
  ]

  let row = 0
  let col = 0

  expertiseAreas.forEach((area, index) => {
    row = Math.floor(index / 2)
    col = index % 2

    slide4.addShape(pres.ShapeType.rect, {
      x: 1 + col * 5,
      y: 1.8 + row * 2,
      w: 4.5,
      h: 1.5,
      fill: { color: "101010" },
      line: { color: "333333", width: 1 },
      shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "000000", opacity: 0.3 },
    })

    slide4.addText(area, {
      x: 1 + col * 5,
      y: 1.8 + row * 2,
      w: 4.5,
      h: 1.5,
      fontSize: 18,
      color: "FFFFFF",
      bold: true,
      align: "center",
      valign: "middle",
    })
  })

  // Add a contact slide
  const slide5 = pres.addSlide()
  slide5.background = { color: "000000" }

  // Add a gradient overlay
  slide5.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { type: "gradient", color1: "101010", color2: "000000", angle: 45 },
  })

  slide5.addText("Contact Information", {
    x: 1,
    y: 0.5,
    w: 10,
    h: 1,
    fontSize: 32,
    color: "FFFFFF",
    bold: true,
  })

  slide5.addText(
    [
      { text: "Email: dabhiharshit11@gmail.com" },
      { text: "Phone: +971556453208" },
      { text: "Location: Dubai, UAE" },
      { text: "Website: www.harshitdabhi.com" },
    ],
    {
      x: 1,
      y: 2,
      w: 10,
      h: 2,
      fontSize: 20,
      color: "CCCCCC",
      lineSpacing: 40,
    },
  )

  slide5.addText("Let's Connect", {
    x: 1,
    y: 4.5,
    w: 10,
    h: 0.5,
    fontSize: 24,
    color: "FFFFFF",
    bold: true,
  })

  slide5.addText(
    "Looking for a digital marketing professional with expertise in programmatic advertising and media buying? I'd love to discuss how I can help elevate your marketing strategy.",
    {
      x: 1,
      y: 5.2,
      w: 10,
      h: 1,
      fontSize: 16,
      color: "CCCCCC",
    },
  )

  // Save the presentation
  pres.writeFile({ fileName: "harshit-dabhi-portfolio.pptx" })
}
