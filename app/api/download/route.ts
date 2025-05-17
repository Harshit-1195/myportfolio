import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const { format, data } = await request.json()

    if (format === "pdf") {
      // Generate PDF
      const doc = new jsPDF()

      // Add content to the PDF based on the data
      doc.setFontSize(22)
      doc.text(data.name || "Harshit Dabhi", 20, 20)

      doc.setFontSize(14)
      doc.text(data.title || "Digital Marketing Professional", 20, 30)

      // Convert PDF to base64
      const pdfBase64 = doc.output("datauristring")

      return NextResponse.json({
        success: true,
        fileUrl: pdfBase64,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unsupported format",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error generating document:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate document",
      },
      { status: 500 },
    )
  }
}

// Make sure the GET handler is async
export async function GET(request: Request) {
  // Implementation...
}
