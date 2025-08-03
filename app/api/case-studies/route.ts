import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const project = "Harshit Dabhi";
  const type = "Case Study";
  const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/news?project=${encodeURIComponent(
    project
  )}&type=${encodeURIComponent(type)}`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch case studies:", err);
    return NextResponse.json([], { status: 500 });
  }
}
