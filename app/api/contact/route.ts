import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function formatField(value: string) {
  return value || "Not provided";
}

function buildTextEmail(payload: ContactFormPayload, submittedAt: string) {
  return [
    "New Quantafyre contact form submission",
    "",
    `Submitted at: ${submittedAt}`,
    `Name: ${payload.firstName} ${payload.lastName}`.trim(),
    `Email: ${payload.email}`,
    `Phone: ${formatField(payload.phone)}`,
    `Company: ${formatField(payload.company)}`,
    `Service: ${formatField(payload.service)}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function buildHtmlEmail(payload: ContactFormPayload, submittedAt: string) {
  const messageHtml = escapeHtml(payload.message).replace(/\n/g, "<br>");

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h1 style="font-size: 20px; margin-bottom: 16px;">New Quantafyre Contact Form Submission</h1>
      <p style="margin: 0 0 20px;">Submitted at: ${escapeHtml(submittedAt)}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tbody>
          <tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><strong>Name</strong></td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(`${payload.firstName} ${payload.lastName}`.trim())}</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><strong>Email</strong></td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.email)}</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><strong>Phone</strong></td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(formatField(payload.phone))}</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><strong>Company</strong></td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(formatField(payload.company))}</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><strong>Service</strong></td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(formatField(payload.service))}</td></tr>
        </tbody>
      </table>
      <div style="margin-top: 24px;">
        <h2 style="font-size: 16px; margin-bottom: 8px;">Message</h2>
        <p style="margin: 0;">${messageHtml}</p>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const contactToEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!resendApiKey || !contactToEmail || !contactFromEmail) {
    return NextResponse.json(
      { error: "Contact form is not configured on the server." },
      { status: 500 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The contact form payload could not be read." },
      { status: 400 },
    );
  }

  const rawPayload =
    requestBody && typeof requestBody === "object"
      ? (requestBody as Record<string, unknown>)
      : {};

  const payload: ContactFormPayload = {
    firstName: normalizeString(rawPayload.firstName),
    lastName: normalizeString(rawPayload.lastName),
    email: normalizeString(rawPayload.email),
    phone: normalizeString(rawPayload.phone),
    company: normalizeString(rawPayload.company),
    service: normalizeString(rawPayload.service),
    message: normalizeString(rawPayload.message),
  };

  if (!payload.firstName) {
    return NextResponse.json(
      { error: "Please enter your first name." },
      { status: 400 },
    );
  }

  if (!payload.email || !EMAIL_REGEX.test(payload.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!payload.message) {
    return NextResponse.json(
      { error: "Please tell us a little about your project." },
      { status: 400 },
    );
  }

  const submittedAt = new Date().toISOString();

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        subject: "New Quantafyre Contact Form Submission",
        reply_to: payload.email,
        html: buildHtmlEmail(payload, submittedAt),
        text: buildTextEmail(payload, submittedAt),
      }),
    });

    const resendResult = (await resendResponse.json().catch(() => null)) as
      | { id?: string; error?: unknown }
      | null;

    if (!resendResponse.ok) {
      console.error("Resend email send failed", resendResult);

      return NextResponse.json(
        { error: "We couldn't send your request right now. Please try again shortly." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: resendResult?.id ?? null,
      message: "Thanks for reaching out. Your request has been sent.",
    });
  } catch (error) {
    console.error("Unexpected contact form error", error);

    return NextResponse.json(
      { error: "We couldn't send your request right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
