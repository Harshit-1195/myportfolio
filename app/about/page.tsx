import { PersonJsonLd } from "@/components/json-ld"

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd
        name="Your Name"
        description="Digital marketing expert with over 10 years of experience in programmatic advertising, SEO, and content strategy."
        image={`${process.env.NEXT_PUBLIC_BASE_URL}/profile-photo.jpg`}
        jobTitle="Digital Marketing Consultant"
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/about`}
        sameAs={[
          "https://twitter.com/yourhandle",
          "https://linkedin.com/in/yourprofile",
          "https://instagram.com/yourhandle",
        ]}
      />

      {/* Rest of your about page content */}
      {/* ... */}
    </>
  )
}
