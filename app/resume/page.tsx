"use client"

import { Button } from "@/components/ui/button"
import { FileDown, ChevronDown, ChevronUp, ExternalLink, X, Award } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import FloatingActionButton from "@/components/floating-action-button"
import Image from "next/image"
import PageParticles from "@/components/page-particles"
import { useState } from "react"
import { BackToHomeAlt } from "@/components/back-to-home-alt"

type Certificate = {
  name: string
  organization: string
  issuedDate: string
  expiryDate?: string
  credentialId?: string
  skills?: string[]
  logo: string
  pdfUrl?: string
}

export default function ResumePage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [expandedExperience, setExpandedExperience] = useState<number | null>(0)
  const [expandedEntrepreneurial, setExpandedEntrepreneurial] = useState<number | null>(0)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [showAllCertificates, setShowAllCertificates] = useState(false)

  const toggleExperience = (id: number) => {
    setExpandedExperience(expandedExperience === id ? null : id)
  }

  const toggleEntrepreneurial = (id: number) => {
    setExpandedEntrepreneurial(expandedEntrepreneurial === id ? null : id)
  }

  // Certificates data
  const certificates: Certificate[] = [
    {
      name: "Digital Out-of-Home Certification Course",
      organization: "StackAdapt",
      issuedDate: "Jan 2025",
      credentialId: "tzh6e53cn7ih",
      skills: ["Programmatic Advertising", "Programmatic Media Buying", "DOOH"],
      logo: "/stackadapt-logo.png",
    },
    {
      name: "In-Game Channel Certification",
      organization: "StackAdapt",
      issuedDate: "Jan 2025",
      credentialId: "5rq3crtofyuq",
      skills: ["Programmatic Advertising", "Programmatic Media Buying"],
      logo: "/stackadapt-logo.png",
    },
    {
      name: "Data Driven Planning",
      organization: "The Trade Desk",
      issuedDate: "Nov 2024",
      expiryDate: "Nov 2026",
      skills: ["Media Planning", "Programmatic Media Buying"],
      logo: "/the-trade-desk-logo.png",
    },
    {
      name: "Fundamentals and Applications of Attention",
      organization: "Adelaide",
      issuedDate: "Oct 2024",
      credentialId: "78ZOGS2HNA",
      skills: ["Programmatic Media Buying"],
      logo: "/adelaide-logo.png",
    },
    {
      name: "The Role of Attention Metrics in a Privacy-First World",
      organization: "Adelaide",
      issuedDate: "Oct 2024",
      credentialId: "Tf9MkRvhNA",
      skills: ["Programmatic Media Buying", "Programmatic Advertising"],
      logo: "/adelaide-logo.png",
    },
    {
      name: "Advanced TV for Advertisers",
      organization: "Magnite",
      issuedDate: "Aug 2024",
      credentialId: "225979876",
      skills: ["Programmatic Media Buying"],
      logo: "/magnite-logo.png",
    },
    {
      name: "Contextual 101",
      organization: "Seedtag",
      issuedDate: "Aug 2024",
      credentialId: "bf0JbU9tfw",
      skills: ["Programmatic Media Buying", "Programmatic Advertising"],
      logo: "/seedtag-logo.png",
    },
    {
      name: "Marketing & Brand Strategy",
      organization: "CIM | The Chartered Institute of Marketing",
      issuedDate: "Jan 2024",
      pdfUrl: "/Marketing & Brand Strategy CIM.pdf",
      logo: "/cim-logo.png",
    },
    // Second batch of certificates
    {
      name: "Advance Branding",
      organization: "LinkedIn",
      issuedDate: "Dec 2023",
      logo: "/linkedin-logo.png",
    },
    {
      name: "Data Strategy",
      organization: "LinkedIn",
      issuedDate: "Jul 2023",
      logo: "/linkedin-logo.png",
    },
    {
      name: "Digital Audio Foundations",
      organization: "Spotify",
      issuedDate: "May 2023",
      credentialId: "258657634",
      skills: ["Audio advertising"],
      logo: "/spotify-logo.png",
    },
    {
      name: "Intro to Ad Studio",
      organization: "Spotify",
      issuedDate: "May 2023",
      credentialId: "258658411",
      skills: ["Audio advertising"],
      logo: "/spotify-logo.png",
    },
    {
      name: "LinkedIn Marketing Fundamentals Certified",
      organization: "LinkedIn",
      issuedDate: "Feb 2023",
      credentialId: "mdd8eavrbz3g",
      skills: ["Advertising", "Lead Generation"],
      logo: "/linkedin-logo.png",
    },
    {
      name: "Google Ads Display Certification",
      organization: "Google",
      issuedDate: "Jan 2023",
      credentialId: "139814774",
      skills: ["Brand Awareness", "Pay Per Click (PPC)"],
      logo: "/google-logo.png",
    },
    {
      name: "Proofpoint Certified Phishing Specialist",
      organization: "Proofpoint",
      issuedDate: "Jan 2023",
      skills: ["Email Marketing"],
      logo: "/proofpoint-logo.png",
    },
    // Third batch of certificates
    {
      name: "Search Ads 360 Certification Exam",
      organization: "Google",
      issuedDate: "Jan 2023",
      credentialId: "138551587",
      skills: ["Brand Awareness", "Pay Per Click (PPC)"],
      logo: "/google-logo.png",
    },
    {
      name: "Waze Ads Fundamentals",
      organization: "Waze",
      issuedDate: "Jan 2023",
      credentialId: "138350039",
      skills: ["Brand Awareness", "Pay Per Click (PPC)"],
      logo: "/waze-logo.png",
    },
    {
      name: "ANA Marketing Growth Agenda",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Mar 2022",
      skills: [
        "Online Advertising",
        "Marketing Strategy",
        "Online Marketing",
        "Content Strategy",
        "Management",
        "Marketing Communications",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Paid Media Advertising",
        "Digital Marketing",
        "Google Analytics",
        "Media Buying",
        "Research",
        "Content Marketing",
        "Growth Strategies",
        "Performance Marketing",
        "Market Research",
        "Social Media Marketing",
        "Google Ads",
        "Data Analysis",
      ],
      logo: "/cannes-lions-logo.png",
    },
    {
      name: "Tiktok Academy Pro",
      organization: "TikTok For Business MEA",
      issuedDate: "Feb 2022",
      skills: [
        "Online Advertising",
        "Online Marketing",
        "Content Strategy",
        "Advertising",
        "Brand Awareness",
        "Digital Marketing",
        "Pay Per Click (PPC)",
        "Social Media Marketing",
      ],
      logo: "/tiktok-logo.png",
    },
    {
      name: "Email Marketing",
      organization: "HubSpot",
      issuedDate: "Jan 2022",
      credentialId: "aed285f7ae194db0a5f8416162e5671c",
      skills: [
        "Online Marketing",
        "Content Strategy",
        "Email Marketing",
        "Advertising",
        "Brand Awareness",
        "Digital Marketing",
        "Content Marketing",
      ],
      logo: "/hubspot-logo.png",
    },
    {
      name: "SEO",
      organization: "HubSpot",
      issuedDate: "Jan 2022",
      credentialId: "fddb6c654ad244b4bf94cc108f9f36aa",
      skills: [
        "Online Advertising",
        "Online Marketing",
        "Content Strategy",
        "Brand Awareness",
        "Digital Marketing",
        "Content Marketing",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/hubspot-logo.png",
    },
    {
      name: "Google Tag Manager Fundamentals",
      organization: "Google",
      issuedDate: "Dec 2021",
      skills: [
        "Online Marketing",
        "Digital Marketing",
        "Google Analytics",
        "Search Engine Optimization (SEO)",
        "Data Analysis",
      ],
      logo: "/google-logo.png",
    },
    // Third batch of certificates (continued)
    {
      name: "Sport Event Management",
      organization: "International Olympic Committee – IOC",
      issuedDate: "Dec 2021",
      skills: ["Marketing Communications", "Team Management", "Advertising", "Problem Solving"],
      logo: "/olympic-rings.png",
    },
    {
      name: "Sports Media",
      organization: "International Olympic Committee – IOC",
      issuedDate: "Dec 2021",
      skills: [
        "Online Marketing",
        "Content Strategy",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Digital Marketing",
        "Media Buying",
        "Content Marketing",
        "Social Media Marketing",
        "Communication",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/olympic-rings.png",
    },
    {
      name: "Sports Psychology",
      organization: "International Olympic Committee – IOC",
      issuedDate: "Dec 2021",
      skills: [
        "Research",
        "Professional Communication",
        "Marketing Communications",
        "Communication",
        "Problem Solving",
        "Digital Marketing",
      ],
      logo: "/olympic-rings.png",
    },
    {
      name: "Google Analytics",
      organization: "Google",
      issuedDate: "Nov 2021",
      skills: [
        "Online Marketing",
        "Digital Marketing",
        "Google Analytics",
        "Research",
        "Market Research",
        "Data Analysis",
      ],
      logo: "/google-logo.png",
    },
    {
      name: "Google My Business",
      organization: "Google",
      issuedDate: "Nov 2021",
      credentialId: "97287368",
      skills: [
        "Marketing Communications",
        "Brand Awareness",
        "Digital Marketing",
        "Research",
        "Content Marketing",
        "Performance Marketing",
      ],
      logo: "/google-logo.png",
    },
    {
      name: "Creative Effectiveness",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Sep 2021",
      skills: [
        "Content Strategy",
        "Marketing Communications",
        "Problem Solving",
        "Brand Awareness",
        "Digital Marketing",
        "Content Marketing",
        "Growth Strategies",
        "Performance Marketing",
        "Communication",
      ],
      logo: "/cannes-lions-logo.png",
    },
    {
      name: "Applied Behavioral Science",
      organization: "Ogilvy",
      issuedDate: "Aug 2021",
      skills: [
        "Content Strategy",
        "Team Management",
        "Digital Marketing",
        "Research",
        "Content Marketing",
        "Professional Communication",
        "Market Research",
        "Communication",
      ],
      logo: "/placeholder-qjxa2.png",
    },
    {
      name: "Copywriting",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Aug 2021",
      skills: [],
      logo: "/cannes-lions-logo.png",
    },
    // Fourth batch of certificates
    {
      name: "Digital Marketing",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Aug 2021",
      skills: [
        "Online Advertising",
        "Marketing Strategy",
        "Online Marketing",
        "Content Strategy",
        "Email Marketing",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Paid Media Advertising",
        "Digital Marketing",
        "Media Buying",
        "Content Marketing",
        "Performance Marketing",
        "Social Media Marketing",
        "Google Ads",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/cannes-lions-logo.png",
    },
    {
      name: "Marketing Strategy",
      organization: "WARC",
      issuedDate: "Aug 2021",
      skills: [
        "Online Advertising",
        "Marketing Strategy",
        "Online Marketing",
        "Content Strategy",
        "Marketing Communications",
        "Email Marketing",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Paid Media Advertising",
        "Digital Marketing",
        "Research",
        "Content Marketing",
        "Growth Strategies",
        "Professional Communication",
        "Performance Marketing",
        "Market Research",
        "Social Media Marketing",
        "Google Ads",
      ],
      logo: "/warc-logo.png",
    },
    {
      name: "Diploma In Consumer Psychology",
      organization: "Alison",
      issuedDate: "Jul 2021",
      skills: [
        "Online Marketing",
        "Marketing Communications",
        "Problem Solving",
        "Digital Marketing",
        "Research",
        "Professional Communication",
        "Market Research",
        "Communication",
      ],
      logo: "/alison-logo.png",
    },
    {
      name: "Digital Marketing",
      organization: "Accenture",
      issuedDate: "Apr 2021",
      skills: [
        "Online Advertising",
        "Online Marketing",
        "Content Strategy",
        "Management",
        "Marketing Communications",
        "Email Marketing",
        "Programmatic Media Buying",
        "Digital Marketing",
        "Content Marketing",
        "Social Media Marketing",
        "Google Ads",
      ],
      logo: "/accenture-logo.png",
    },
    {
      name: "Digital skill- User Experience",
      organization: "Accenture",
      issuedDate: "Mar 2021",
      skills: [
        "Online Advertising",
        "Content Strategy",
        "Digital Marketing",
        "Content Marketing",
        "Social Media Marketing",
        "Google Ads",
        "Data Analysis",
      ],
      logo: "/accenture-logo.png",
    },
    {
      name: "Google Digital Unlocked",
      organization: "Google",
      issuedDate: "May 2018",
      skills: [
        "Online Advertising",
        "Content Strategy",
        "Paid Media Advertising",
        "Digital Marketing",
        "Social Media Marketing",
        "Google Ads",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/google-logo.png",
    },
    {
      name: "StartUp India Learning Program",
      organization: "Invest India",
      issuedDate: "Jun 2017",
      credentialId: "10755131",
      skills: [
        "Marketing Strategy",
        "Management",
        "Team Management",
        "Problem Solving",
        "Research",
        "Content Marketing",
        "Professional Communication",
        "Leadership",
        "Business Decision Making",
      ],
      logo: "/invest-india-logo.png",
    },
    {
      name: "Amazon FBA Master plan",
      organization: "Udemy",
      issuedDate: "Apr 2017",
      credentialId: "UC-HU774CQ2",
      skills: ["Research"],
      logo: "/udemy-logo.png",
    },
    {
      name: "Digital Marketing Certification Course",
      organization: "The Marketing Nerdz",
      issuedDate: "Mar 2016",
      skills: [
        "Online Advertising",
        "Content Strategy",
        "Marketing Communications",
        "Email Marketing",
        "Programmatic Media Buying",
        "Digital Marketing",
        "Content Marketing",
        "Social Media Marketing",
        "Google Ads",
      ],
      logo: "/marketing-nerdz-logo.png",
    },
    {
      name: "Professional Etiquette",
      organization: "Saylor Academy",
      issuedDate: "Aug 2015",
      skills: [
        "Management",
        "Team Management",
        "Content Marketing",
        "Communication",
        "Leadership",
        "Business Decision Making",
      ],
      logo: "/saylor-academy-logo.png",
    },
    {
      name: "Resume writting",
      organization: "Saylor Academy",
      issuedDate: "Aug 2015",
      skills: ["Content Marketing"],
      logo: "/saylor-academy-logo.png",
    },
    {
      name: "Spreadsheets",
      organization: "Saylor Academy",
      issuedDate: "Aug 2015",
      skills: [],
      logo: "/saylor-academy-logo.png",
    },
    {
      name: "CIM ACIM Member",
      organization: "CIM | The Chartered Institute of Marketing",
      issuedDate: "Dec 2023",
      expiryDate: "Jan 2025",
      skills: [],
      logo: "/cim-logo.png",
    },
    {
      name: "Campaign Manager 360",
      organization: "Google",
      issuedDate: "Jan 2024",
      expiryDate: "Jan 2025",
      credentialId: "253520954",
      skills: [],
      logo: "/google-logo.png",
    },
    {
      name: "Display & Video 360 Certification Exam",
      organization: "Google",
      issuedDate: "Jan 2024",
      expiryDate: "Jan 2025",
      skills: [],
      logo: "/google-logo.png",
    },
  ]

  // Static experiences data
  const experiences = [
    {
      id: 1,
      title: "Performance & Programmatic Manager",
      company: "Media Agency Group",
      period: "Feb 2024 - Present",
      location: "Dubai, UAE",
      description: [
        "Campaign Management: Managed and executed global programmatic campaigns for accounts including NHS, Knowsley Safari, Ariana Grande Perfumes, Lexis Nexis, Ghost Perfumes, Clear Blue, Al Siddiqi Group (Retail), Avis Rental, Klarna, Komatsu & F1 Abu Dhabi, Kuwait Airways, DWF Labs, Interlace money, Government Of Bangladesh, APM Monaco.",
        "DSP Collaboration & Negotiation: Engaged with major DSPs like DV360, GMP, The Trade Desk (TTD), Amazon, YAN network, Stackadapt and Quantcast for a variety of clients to secure better media costs, ensuring maximum performance and audience targeting accuracy.",
        "Global Media Collaborations: Worked closely with media inventory suppliers across MENA, Asia, Russia, Americas, and Europe, achieving a global reach for clients.",
        "Optimization: Reduced dead inbound leads by 74% MoM and improved MQL & SQL inquiries from 11% to 38%.",
        "ROI & Performance: Generated an average 6:1 ROI across campaigns and was recognized as the best performer for consecutive quarters.",
        "Internal PPC Campaign Management: Handled internal PPC global campaigns with a quarterly budget of GBP 100K, ensuring performance optimization across channels.",
        "Tracking & Analytics Implementation: Implemented phone call tracking tools to monitor inbound leads from various sources and set up & troubleshoot event and tracking tags.",
        "Data Analysis: Leveraged GA4, Tableau, Salesforce, and other analytics tools to generate actionable insights for campaign performance and optimizations.",
        "Stakeholder Reporting: Prepared and presented weekly and biweekly reports for stakeholders, including c-suite management, ensuring transparency and alignment on campaign performance.",
        "Media Planning: Created and executed media plans in collaboration with DSPs to maximize campaign reach and effectiveness across different industries.",
        "Direct Reporting: Reported directly to the director and chairperson, providing strategic input and media performance updates.",
      ],
    },
    {
      id: 2,
      title: "Performance Marketing Manager",
      company: "Vazir Group",
      period: "Feb 2023 - Feb 2024",
      location: "Dubai, UAE",
      description: [
        "Developed and executed paid media strategies for investment and migration programs across North America, EMEA, GCC, APAC, Caribbean, and Turkey, enhancing brand visibility and engagement.",
        "Led high-performing media buying campaigns on platforms like Google Ads, Meta (Facebook & Instagram), LinkedIn, and Waze, resulting in a 126% increase in website traffic and a 1173% boost in social media engagement.",
        "Achieved an 86% increase in click-through rate (CTR) and a 62.7% rise in conversion rates on Google Ads by optimizing bidding strategies, conducting detailed keyword research, and refining ad creatives.",
        "Launched specialized campaigns for Caribbean citizenship and European residency programs, using precise targeting and efficient budget allocation to maximize ROI.",
        "Developed and managed a data-driven approach for PPC across multiple channels, including performance analysis to ensure ad spend efficiency and high-quality lead generation.",
        "Executed USA business migration campaigns, resulting in an 11% increase in qualified inquiries, through targeted media buying and market-specific ad content.",
        "Enhanced user experience and engagement through data analytics, leveraging tools like Microsoft Clarity to reduce bounce rates by 88% and inform ad optimizations.",
        "Provided comprehensive reporting on paid media performance, PPC metrics, and campaign impact, highlighting key insights for continuous improvement.",
        "Reported directly to the Managing Director and Chairperson, providing detailed reports on PPC and paid media success to drive ongoing campaign improvements.",
      ],
    },
    {
      id: 3,
      title: "Digital & Marketing Manager",
      company: "UNO Capital",
      period: "Jan 2022 - Feb 2023",
      location: "Dubai, UAE",
      description: [
        "Developed targeted digital strategies to reach high-net-worth and ultra-high-net-worth individuals, maximizing engagement and conversions in premium market segments.",
        "Led and coordinated a team of digital marketers and media specialists to execute high-performing paid media campaigns aligned with company objectives.",
        "Achieved a 1.68% conversion rate, the highest in the industry, through data-driven digital strategies and campaign optimization.",
        "Leveraged multiple digital channels—including Google Search, Google Display, Meta (Facebook & Instagram), LinkedIn, Snapchat, and TikTok—to drive brand awareness and generate high-quality leads in new markets across Nigeria, EMEA, and North Africa.",
        "Enhanced lead quality by 34.8% within six months, thanks to a diversified digital channel strategy and refined targeting techniques.",
        "Delivered a 3.91% goal conversion rate on PPC campaigns, implementing continuous testing and optimization for maximum performance.",
        "Drove a 77.8% increase in lead generation year-over-year by utilizing performance-focused paid media strategies and in-depth analytics.",
        "Executed native advertising campaigns on platforms like Smartyads, Outbrain, and Propeller Ads to reach the right audience and maintain brand authenticity.",
        "Managed $100K in quarterly and annual budgets for paid media, with a focus on efficiency and return on ad spend (ROAS).",
        "Performed budget analysis, forecasting, and regular performance tracking to ensure effective use of paid media resources.",
        "Oversaw end-to-end execution of digital ad campaigns, integrating AI-driven chatbots and location-based targeting to increase lead engagement and conversion rates.",
      ],
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      company: "Samana Group",
      period: "Sep 2021 - Dec 2021",
      location: "Dubai, UAE",
      description: [
        "Responsible for lead generation campaigns for their real estate company, immigration company.",
        "Implementation of Google analytics and tag manager for analysis of their data on daily basis for a couple of events on their campaign.",
        "Handling digital ads spending & ads budget of approx $100k.",
        "Achieved ROAS of 483.2% average on each ad campaigns.",
        "Generated leads across range of audiences & segments.",
        "Curating & publishing Arabic social media, search engine ads, and content coordinating with Arabic content writer.",
        "Optimization of Google and social media ads on daily basis.",
        "Executed online ad campaigns ranging from the display and maps to target new geolocation for immigration companies for business immigration and investment opportunities in the GCC region and some Middle East countries.",
      ],
    },
    {
      id: 5,
      title: "Digital Marketing Strategist",
      company: "Espada Group",
      period: "Feb 2021 - Sep 2021",
      location: "Dubai, UAE",
      description: [
        "Responsible for curating Digital Marketing Strategies & Content Strategy for three entities of the group Espada Business Center, Espada Technical Services, Dental Hub Clinic.",
        "Implementation of various Digital Marketing strategy-curation of monthly content calendar and formulating Google ads strategy and social media marketing strategy as per the data.",
        "Successfully reached the goal with a stipulated time frame to get them desired hot leads.",
        "Managing their online presence, local SEO.",
        "Framework and website development.",
        "Equally responsible for their creative marketing and designing.",
        "PPC ads for every business, with consistent CTR of 8.4% and conversion rate of 6.3%.",
        "Overall digital organic impression & reach of every business entity is more than 200% on social media within 6 months.",
      ],
    },
    {
      id: 6,
      title: "Creative Marketing Manager",
      company: "Vile Parle Premier League",
      period: "Dec 2014 - Dec 2018",
      location: "Mumbai, India",
      description: [
        "Led creative direction and marketing initiatives for the Vile Parle Premier League, a 14-day community football event with nine regional teams.",
        "Developed innovative advertising and marketing strategies, delivering cohesive and compelling campaigns.",
        "Ensured high-quality standards of creative content for new-business opportunities and client pitches.",
        "Designed captivating layouts and visuals across multiple mediums, including logos, packaging, advertising materials, and digital assets.",
        "Curated photos, typography, illustrations, and color schemes to enhance brand identity and visual appeal.",
        "Conducted detailed press checks to maintain the accuracy and quality of printed materials.",
        "Coordinated and managed all aspects of the event, showcasing expertise in creative strategy, design, and community engagement.",
        "Drove the success of the Vile Parle Premier League as a model of impactful marketing, creative vision, and community involvement.",
      ],
    },
    {
      id: 7,
      title: "Startup Ambassador",
      company: "Startup Jalsa",
      period: "Sep 2017 - Sep 2018",
      location: "Mumbai, India",
      description: [
        "Facilitated 50+ successful startup-investor matches, resulting in $3M+ in seed funding.",
        "Built and engaged a community of 2,000+ entrepreneurs through LinkedIn and Instagram.",
        "Organized 25+ networking events and pitch sessions, connecting 200+ startups with top-tier VCs.",
        "Created digital content reaching 100K+ monthly impressions, highlighting startup success stories.",
        "Mentored 30+ early-stage startups on pitch deck optimization and investor outreach.",
        "Partnered with 15+ incubators and accelerators to create startup growth opportunities.",
        "80% success rate in startup placement into leading accelerator programs.",
        "Developed relationships with 100+ angel investors and 30+ VC firms.",
        "Launched digital mentorship program connecting founders with industry experts.",
        "Created weekly newsletter reaching 5,000+ ecosystem stakeholders.",
      ],
    },
    {
      id: 8,
      title: "Digital Marketing Executive",
      company: "Massive Connexion",
      period: "June 2016 - June 2017",
      location: "Mumbai, India",
      description: [
        "Increased event registration by 85% through targeted paid campaigns, driving 15,000+ attendees for flagship tech conferences & local social events.",
        "Generated 2.5M+ impressions and 45K+ engagements across social channels for international trade show series.",
        "Achieved a 42% reduction in cost per registration through an optimized multi-channel campaign strategy.",
        "Managed $50K annual digital marketing budget across events portfolio.",
        "Launched a successful hybrid event promotion strategy reaching 125K+ virtual attendees",
      ],
    },
    {
      id: 9,
      title: "Social Media Intern",
      company: "Roast Media",
      period: "May 2016 - June 2016",
      location: "Mumbai, India",
      description: [
        "Create and schedule engaging daily content for TikTok, Instagram, Twitter, and other relevant platforms.",
        "Track social media metrics and prepare weekly performance reports.",
        "Engage with users and respond to comments/messages to build community.",
        "Identify and collaborate with micro-influencers for potential partnerships.",
        "Monitor social media trends and suggest new content strategies.",
        "Assist in planning and executing social media campaigns.",
        "Create short-form video content showcasing app features and user success stories.",
      ],
    },
    {
      id: 10,
      title: "Digital Marketing Intern",
      company: "The Marketing Nerdz",
      period: "April 2016 - May 2016",
      location: "Mumbai, India",
      description: [
        "Created and scheduled daily social media content across Instagram, LinkedIn, and Facebook, increasing follower engagement by 25%.",
        "Assist in managing email marketing campaigns reaching 10,000+ subscribers with average open rate of 22%.",
        "Write and optimize 2-3 blog posts weekly using SEO best practices.",
        "Design social media graphics and marketing collateral using Canva.",
        "Track and report on campaign metrics using Google Analytics and social media analytics tools.",
        "Support team with competitor research and market analysis.",
        "Collaborate with the marketing team on content calendar planning.",
      ],
    },
    {
      id: 11,
      title: "Marketing Co-ordinator",
      company: "Massive Advertising Company",
      period: "Sep 2015 - March 2016",
      location: "Mumbai, India",
      description: [
        "Led 12+ integrated marketing campaigns across digital channels, resulting in 40% higher engagement rates than previous campaigns.",
        "Grew social media following by 65% across platforms through strategic content calendar management and targeted posting.",
        "Increased email marketing open rates from 18% to 28% through A/B testing and audience segmentation Created and optimized content for company blog, achieving 45% increase in organic traffic.",
        "Developed monthly performance reports using Google Analytics and social media insights, identifying key growth opportunities.",
        "Managed $50K quarterly marketing budget across multiple concurrent projects, consistently delivering on time.",
        "Coordinated with the design team and external agencies to produce marketing materials for 3 major product launches.",
        "Streamlined approval process between marketing and sales teams, reducing campaign deployment time by 30%.",
      ],
    },
  ]

  // Entrepreneurial experiences data
  const entrepreneurialExperiences = [
    {
      id: 1,
      title: "Founder",
      company: "The DigitalWit",
      period: "Jan 2016 - Jan 2021",
      location: "Mumbai, Chennai, Chandigarh - India",
      description: [
        "Founded and led a digital agency specializing in comprehensive marketing solutions, including digital advertising, branding, web development, and content creation.",
        "Built and managed a cross-functional team of designers, developers, marketers, and strategists to deliver innovative, client-focused campaigns.",
        "Developed and executed strategic growth initiatives that drove agency expansion and enhanced client acquisition, achieving 64% of gross revenue.",
        "Oversaw end-to-end project management for high-impact digital campaigns, optimizing client ROI through data-driven insights and targeted strategies.",
        "Fostered strong client relationships, providing tailored marketing solutions to a diverse portfolio across industries such as B2B, B2C, D2C etc.",
        "Spearheaded successful digital transformation projects, enabling clients to leverage emerging platforms, technologies, and analytics for competitive advantage.",
        "Drove the agency's creative vision, ensuring high-quality, cohesive brand messaging across all digital touchpoints.",
        "Regularly analyzed and adapted campaign strategies based on performance metrics to maximize engagement, lead generation, and customer retention.",
      ],
    },
    {
      id: 2,
      title: "Managing Partner",
      company: "Encube Enterprise",
      period: "May 2020 - April 2021",
      location: "Mumbai, India",
      description: [
        "Led a 3D printing company specializing in tailored solutions for the medical industry, overseeing operations, strategic planning, and business growth.",
        "Directed the development and production of custom medical devices and models, including prosthetics, implants, and surgical guides, ensuring adherence to industry standards and regulatory compliance.",
        "Cultivated strong relationships with hospitals, medical professionals, and healthcare providers, delivering innovative 3D-printed solutions that enhance patient outcomes.",
        "Spearheaded R&D initiatives to advance 3D printing technologies, focusing on biocompatible materials and precision engineering for medical applications.",
        "Improved operational efficiency and reduced production timelines by implementing streamlined processes and leveraging advanced 3D printing techniques.",
        "Guided cross-functional teams in delivering high-quality, patient-specific products, ensuring quality control and rigorous testing for optimal performance.",
        "Positioned the company as a leader in medical 3D printing through targeted marketing, industry partnerships, and participation in healthcare conferences and trade shows.",
        "Achieved significant business growth by identifying new market opportunities and expanding the client base in the healthcare sector.",
      ],
    },
  ]

  const handleDownloadResume = async () => {
    setIsDownloading(true)
    try {
      // Use our API route which will handle the CMS logic
      window.open("/resume.pdf", "_blank")
    } catch (error) {
      console.error("Error downloading resume:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl bg-black min-h-screen resume-page">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Resume</h1>
          <Button
            variant="outline"
            className="gap-2 glass-panel text-white border-white/20 hover:bg-white/10"
            onClick={handleDownloadResume}
            disabled={isDownloading}
          >
            <FileDown className="w-4 h-4" />
            Download Resume
          </Button>
        </div>

        <ScrollRevealWrapper>
          <div className="glass-panel p-8 rounded-lg mb-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Harshit Dabhi</h2>
              <p className="text-white/70">Performance & Programmatic Manager</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="text-sm text-white/70">
                  <span className="font-medium text-white">Email:</span> dabhiharshit11@gmail.com
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium text-white">Phone:</span> +971556453208
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium text-white">Location:</span> Dubai, UAE
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold border-b border-white/20 pb-2 mb-4 text-white">Summary</h3>
              <p className="text-white/70">
                Experienced Performance & Programmatic Manager with over 8 years of expertise in digital marketing,
                media buying, and campaign optimization. Proven track record of managing global programmatic campaigns,
                collaborating with major DSPs, and achieving exceptional ROI across diverse industries. Skilled in data
                analysis, stakeholder reporting, and strategic media planning with a focus on performance-driven
                results.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-white">Professional Experience</h3>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="timeline-content">
                  <motion.div
                    className="glass-panel p-6 rounded-lg hover-glow relative overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.01,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/5 z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative z-10">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleExperience(exp.id)}
                      >
                        <div>
                          <h4 className="text-xl font-semibold mb-1 text-white">{exp.title}</h4>
                          <div className="flex flex-wrap justify-between mb-3">
                            <p className="font-medium text-white">{exp.company}</p>
                            <p className="text-sm text-white/50 ml-4">{exp.period}</p>
                          </div>
                          <p className="text-sm text-white mb-3">{exp.location}</p>
                        </div>
                        <div className="text-white">
                          {expandedExperience === exp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      {expandedExperience === exp.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ul className="list-disc list-inside space-y-1 text-sm text-white mt-4">
                            {exp.description.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold mb-6 mt-12 text-white">Entrepreneurial Experience</h3>
            <div className="space-y-4">
              {entrepreneurialExperiences.map((exp, index) => (
                <div key={exp.id} className="timeline-content">
                  <motion.div
                    className="glass-panel p-6 rounded-lg hover-glow relative overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.01,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/5 z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative z-10">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleEntrepreneurial(exp.id)}
                      >
                        <div>
                          <h4 className="text-xl font-semibold mb-1 text-white">{exp.title}</h4>
                          <div className="flex flex-wrap justify-between mb-3">
                            <p className="font-medium text-white">{exp.company}</p>
                            <p className="text-sm text-white/50 ml-4">{exp.period}</p>
                          </div>
                          <p className="text-sm text-white mb-3">{exp.location}</p>
                        </div>
                        <div className="text-white">
                          {expandedEntrepreneurial === exp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      {expandedEntrepreneurial === exp.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ul className="list-disc list-inside space-y-1 text-sm text-white mt-4">
                            {exp.description.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Certifications Section */}
            <motion.div
              id="certifications"
              className="mt-12 pt-10 -mt-10" // Added padding-top and negative margin to account for fixed header
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Certifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {certificates.slice(0, 10).map((cert, index) => (
                  <motion.div
                    key={index}
                    className="glass-panel p-6 rounded-lg hover-glow relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{
                      scale: 1.05,
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
                    <div className="relative z-10">
                      <div className="flex items-start mb-4">
                        <div className="relative w-12 h-12 mr-4 flex-shrink-0 bg-white/10 rounded-md p-2">
                          <Image
                            src={cert.logo || "/placeholder.svg?height=48&width=48&query=logo"}
                            alt={cert.organization}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">{cert.name}</h3>
                          <p className="text-sm text-gray-300">{cert.organization}</p>
                        </div>
                      </div>

                      <div className="mb-4 text-sm text-gray-300">
                        <p>
                          Issued {cert.issuedDate}
                          {cert.expiryDate ? ` · Expires ${cert.expiryDate}` : ""}
                        </p>
                        {cert.credentialId && (
                          <p className="text-xs text-gray-400">Credential ID {cert.credentialId}</p>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-4 flex items-center"
                      >
                        Show credential <ExternalLink className="ml-1 h-3 w-3" />
                      </button>

                      {cert.skills && cert.skills.length > 0 && (
                        <div className="mt-auto">
                          <p className="text-xs text-gray-400 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {cert.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                                {skill}
                              </span>
                            ))}
                            {cert.skills.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                                +{cert.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {certificates.length > 10 && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setShowAllCertificates(true)}
                    className="gap-2 glass-panel text-white border-white/20 hover:bg-white/10"
                  >
                    View All Certifications ({certificates.length})
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-white">Technical Skills</h3>
            <motion.div
              className="glass-panel p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ul className="list-disc list-inside space-y-2 text-sm text-white/70">
                <li>
                  <span className="font-medium text-white">Programmatic Platforms:</span> DV360, Trade Desk, Amazon DSP,
                  YAN Network, Quantcast, Smartyads, Outbrain, Stackadapt, Broadsign, CM360
                </li>
                <li>
                  <span className="font-medium text-white">Media Channels:</span> CTV, DOOH, PDOOH, Display, Video,
                  Social, Search, Native, Audio
                </li>
                <li>
                  <span className="font-medium text-white">Analytics Tools:</span> GA4, Tableau, Salesforce, Microsoft
                  Clarity, Adobe Analytics, ZOHO, Tag Manager
                </li>
                <li>
                  <span className="font-medium text-white">Core Competencies:</span> Omnichannel Media Buying, Campaign
                  Optimization, Audience Segmentation, Performance Marketing, Budget Management, Native Advertising,
                  Social Media Advertising, Content Strategy
                </li>
                <li>
                  <span className="font-medium text-white">Ad Serving Tools:</span> Google Search Ads, Meta Ads, TikTok
                  Ads, Snapchat Ads, LinkedIn Ads, Twitter Ads Etc.
                </li>
                <li>
                  <span className="font-medium text-white">Marketing Automation Tools:</span> Braze, Mailchimp, Hubspot,
                  Zoho SalesIq.
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-white">Soft Skills</h3>
            <motion.div
              className="glass-panel p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ul className="list-disc list-inside space-y-2 text-sm text-white/70">
                <li>
                  <span className="font-medium text-white">Leadership:</span> Team management, project leadership,
                  stakeholder management, mentoring and development
                </li>
                <li>
                  <span className="font-medium text-white">Communication:</span> Strong negotiation skills, client
                  relationship management, cross-functional collaboration, presentation skills
                </li>
                <li>
                  <span className="font-medium text-white">Strategic Thinking:</span> Problem-solving, analytical
                  mindset, strategic planning, data-driven decision making
                </li>
                <li>
                  <span className="font-medium text-white">Personal Qualities:</span> Results-oriented, adaptable,
                  detail-oriented, proactive, innovative thinking
                </li>
                <li>
                  <span className="font-medium text-white">Project Management:</span> Budget management, time
                  management, resource allocation, risk assessment, bid management
                </li>
                <li>
                  <span className="font-medium text-white">Cultural Awareness:</span> Experience working with global
                  teams and diverse markets across MENA, EMEA, APAC regions
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-white">Key Skills</h3>
            <motion.div
              className="glass-panel p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2">
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">
                  Multi-Channel Marketing
                </span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Advertising Strategy</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Paid Media Strategy</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">
                  Real-Time Bidding (RTB)
                </span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Performance Management</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">
                  Artificial Intelligence (AI)
                </span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Pay Per Click (PPC)</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Digital Media</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">
                  Programmatic Advertising
                </span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Media Planning</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Brand Strategy</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Investment Strategies</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Budget Management</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Analytical Skills</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Media Buying</span>
                <span className="glass-panel px-3 py-1 rounded-full text-sm text-white/80">Campaign Execution</span>
              </div>
            </motion.div>
          </div>
        </ScrollRevealWrapper>

        {/* Certificate Lightbox */}
        <AnimatePresence>
          {selectedCertificate && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
            >
              <motion.div
                className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="relative w-16 h-16 mr-4 bg-white/10 rounded-md p-2">
                        <Image
                          src={selectedCertificate.logo || "/placeholder.svg?height=64&width=64&query=logo"}
                          alt={selectedCertificate.organization}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedCertificate.name}</h3>
                        <p className="text-gray-300">{selectedCertificate.organization}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg mb-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Issued Date</p>
                        <p className="font-medium text-white">{selectedCertificate.issuedDate}</p>
                      </div>
                      {selectedCertificate.expiryDate && (
                        <div>
                          <p className="text-sm text-gray-400">Expiry Date</p>
                          <p className="font-medium text-white">{selectedCertificate.expiryDate}</p>
                        </div>
                      )}
                      {selectedCertificate.credentialId && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-400">Credential ID</p>
                          <p className="font-medium text-white">{selectedCertificate.credentialId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-2 flex items-center text-white">
                        <Award className="h-5 w-5 mr-2 text-blue-400" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCertificate.pdfUrl && (
                    <div className="mt-6">
                      <a
                        href={selectedCertificate.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Certificate PDF <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Certificates Lightbox */}
        <AnimatePresence>
          {showAllCertificates && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllCertificates(false)}
            >
              <motion.div
                className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900 z-10 pb-4">
                    <h3 className="text-2xl font-bold text-white">All Certifications ({certificates.length})</h3>
                    <button
                      onClick={() => setShowAllCertificates(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {certificates.map((cert, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start mb-4">
                          <div className="relative w-12 h-12 mr-4 flex-shrink-0 bg-white/10 rounded-md p-2">
                            <Image
                              src={cert.logo || "/placeholder.svg?height=48&width=48&query=logo"}
                              alt={cert.organization}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-white">{cert.name}</h4>
                            <p className="text-sm text-gray-300">{cert.organization}</p>
                          </div>
                        </div>

                        <div className="mb-4 text-sm text-gray-300">
                          <p>
                            Issued {cert.issuedDate}
                            {cert.expiryDate ? ` · Expires ${cert.expiryDate}` : ""}
                          </p>
                          {cert.credentialId && (
                            <p className="text-xs text-gray-400">Credential ID {cert.credentialId}</p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCertificate(cert)
                            setShowAllCertificates(false)
                          }}
                          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-4 flex items-center"
                        >
                          Show credential <ExternalLink className="ml-1 h-3 w-3" />
                        </button>

                        {cert.skills && cert.skills.length > 0 && (
                          <div className="mt-auto">
                            <p className="text-xs text-gray-400 mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {cert.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                                  {skill}
                                </span>
                              ))}
                              {cert.skills.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                                  +{cert.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingActionButton />
        <BackToHomeAlt />
      </div>
    </>
  )
}
