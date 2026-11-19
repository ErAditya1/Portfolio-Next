import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { sendEnquiryNotification } from "@/lib/mailer";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Enquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      enquiries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[Enquiries GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error },
        { status: 400 }
      );
    }

    // 1. Save to MongoDB database first
    const enquiry = await Enquiry.create(parsed.data);

    // 2. Await sending the SMTP email notification so serverless runtimes (Vercel) do not kill execution mid-flight
    let emailSent = false;
    let emailError: string | null = null;

    try {
      const mailRes = await sendEnquiryNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        projectType: parsed.data.projectType,
        budget: parsed.data.budget,
        subject: parsed.data.subject,
        message: parsed.data.message,
        source: "contact_portal",
      });

      emailSent = mailRes.success;
      if (!mailRes.success) {
        emailError = mailRes.error || "SMTP delivery unsuccessful";
        console.warn("[Contact API] Mail notification skipped or failed:", emailError);
      }
    } catch (e) {
      console.error("[Contact API] Mailer exception:", e);
      emailError = e instanceof Error ? e.message : "Mailer exception";
    }

    return NextResponse.json(
      {
        message: "Message sent successfully!",
        id: enquiry._id,
        emailDelivered: emailSent,
        ...(emailError ? { emailWarning: emailError } : {}),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Contact API POST Error]:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
