import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // your Gmail address
        pass: process.env.EMAIL_PASS,   // Gmail App Password (not your real password)
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,        // sends to yourself
      replyTo: email,                    // so you can reply directly to the sender
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
          <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 4px; color: #1e0f35; font-size: 20px;">New message from your portfolio</h2>
            <p style="margin: 0; color: #64748b; font-size: 13px;">Received via contact form</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 90px;">Name</td>
              <td style="padding: 8px 0; color: #1e0f35; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
              <td style="padding: 8px 0; color: #4f46e5; font-size: 14px;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject</td>
              <td style="padding: 8px 0; color: #1e0f35; font-size: 14px;">${subject}</td>
            </tr>
          </table>

          <div style="background: #ffffff; border: 1px solid #c0cafc80; border-radius: 10px; padding: 20px;">
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; color: #1e0f35; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
            Hit reply to respond directly to ${name}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] email error:", err);
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
  }
}