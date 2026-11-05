import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, honeypot } = body;

    // Spam protection: if hidden honeypot field is filled, silently discard spam
    if (honeypot) {
      console.warn("Spam submission blocked via honeypot.");
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields (name, email, message)." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // In production, this can send an email to info@jundesigns.rw or log to CRM
    console.log(`Contact message received from ${name} (${email}): ${message.substring(0, 100)}...`);

    return NextResponse.json({
      success: true,
      message: "Murakoze! Your message has been received. Our team will reply shortly.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to submit message." },
      { status: 500 }
    );
  }
}
