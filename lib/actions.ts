"use server"

import { createFormSubmission, getFormSubmissionStats as getDynamoStats } from "@/lib/dynamodb"
import { headers } from "next/headers"

export async function submitContactForm(formData: FormData) {
  try {
    // Get form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Get request headers for tracking
    const headersList = headers()
    const userAgent = headersList.get("user-agent")
    const referer = headersList.get("referer")

    // Store in DynamoDB
    await createFormSubmission({
      first_name: firstName,
      last_name: lastName,
      email: email,
      subject: subject || null,
      message: message,
      user_agent: userAgent || null,
      referrer: referer || null,
    })

    // Return success
    return { success: true }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return { success: false, error: "Failed to submit form" }
  }
}

// Function to get all form submissions
export async function getFormSubmissions() {
  try {
    const { getAllFormSubmissions } = await import("@/lib/dynamodb")
    return await getAllFormSubmissions()
  } catch (error) {
    console.error("Error in getFormSubmissions:", error)
    return []
  }
}

// Function to get form submission stats
export async function getFormSubmissionStats() {
  try {
    return await getDynamoStats()
  } catch (error) {
    console.error("Error in getFormSubmissionStats:", error)
    return { totalCount: 0, lastWeekCount: 0, topReferrers: [] }
  }
}
