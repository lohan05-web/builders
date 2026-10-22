import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  isContactFormValid,
  validateContactForm,
  type ContactFormValues,
} from "@/data/contact";
import { getSiteSettings } from "@/sanity/lib/fetch";

/**
 * Simple in-memory rate limiting.
 * Keyed by the client IP address; resets when the process restarts.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // max requests per window
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const [ip] = forwarded.split(",");
    if (ip?.trim()) return ip.trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return { allowed: true };
}

/**
 * Quote form endpoint.
 *
 * Sends enquiries via Resend when credentials are configured. Otherwise falls
 * back to logging to the server console for local development.
 */
export async function POST(request: Request) {
  // --- Rate limiting -------------------------------------------------------
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many requests. Please try again in a few minutes.",
      },
      {
        status: 429,
        headers: rateLimit.retryAfter
          ? { "Retry-After": String(rateLimit.retryAfter) }
          : undefined,
      },
    );
  }

  let payload: Partial<ContactFormValues>;

  try {
    payload = (await request.json()) as Partial<ContactFormValues>;
  } catch {
    return NextResponse.json(
      { ok: false, message: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  // --- Honeypot -----------------------------------------------------------
  // Real users never see this field, so anything in it is a bot. Answer with
  // a normal success response so the bot does not learn it was caught.
  if (payload.website) {
    return NextResponse.json({
      ok: true,
      message: "Thanks — your enquiry has been received.",
    });
  }

  // --- Validation ---------------------------------------------------------
  const errors = validateContactForm(payload);

  if (!isContactFormValid(errors)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please correct the highlighted fields.",
        errors,
      },
      { status: 400 },
    );
  }

  // --- Normalise the data --------------------------------------------------
  const enquiry = {
    name: (payload.name ?? "").trim(),
    phone: (payload.phone ?? "").trim(),
    email: (payload.email ?? "").trim() || null,
    projectType: payload.projectType || null,
    budget: payload.budget || null,
    message: (payload.message ?? "").trim(),
    receivedAt: new Date().toISOString(),
    ip,
  };

  // --- Email delivery via Resend (or console fallback) --------------------
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

  // The company name comes from the CMS (falling back to the local copy).
  const site = await getSiteSettings({ revalidate: false });

  if (resendApiKey && contactToEmail && contactFromEmail) {
    try {
      const resend = new Resend(resendApiKey);

      const subject = `New quote request from ${enquiry.name} — ${site.name}`;
      const lines = [
        "New quote enquiry from the website",
        "",
        `Name: ${enquiry.name}`,
        `Phone: ${enquiry.phone}`,
        `Email: ${enquiry.email ?? "Not provided"}`,
        `Project Type: ${enquiry.projectType ?? "Not specified"}`,
        `Approx. Budget: ${enquiry.budget ?? "Not specified"}`,
        "",
        "Message:",
        enquiry.message,
        "",
        `Received: ${enquiry.receivedAt}`,
        `IP: ${enquiry.ip}`,
      ];

      const { error } = await resend.emails.send({
        from: contactFromEmail,
        to: [contactToEmail],
        subject,
        text: lines.join("\n"),
        replyTo: enquiry.email ?? undefined,
      });

      if (error) {
        console.error("[contact] Resend error:", error);
        // Still return success to the user to avoid leaking details, but log it.
      }
    } catch (err) {
      console.error("[contact] Failed to send email via Resend:", err);
    }
  } else {
    // Local development fallback — log the full enquiry to the console.
    console.log("[contact] new quote request (console fallback):", enquiry);
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks — your enquiry has been received.",
  });
}
