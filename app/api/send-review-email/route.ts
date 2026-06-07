import { render } from "@react-email/render";
import { createElement } from "react";
import { Resend } from "resend";
import ReviewEmail from "@/components/ReviewEmail";

export const runtime = "nodejs";

type ReviewEmailRequest = {
  customerName?: unknown;
  customerEmail?: unknown;
  workCompleted?: unknown;
  personalMessage?: unknown;
};

// Change the subject line here if the review email subject needs updating.
const SUBJECT = "Thank you from 1st Choice Roofers";

// Change the sender address here once the Resend domain is fully verified.
const FROM_EMAIL = "1st Choice Roofers <reviews@1stchoiceroofers.uk>";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePayload(payload: ReviewEmailRequest) {
  const customerName = cleanString(payload.customerName);
  const customerEmail = cleanString(payload.customerEmail);
  const workCompleted = cleanString(payload.workCompleted);
  const personalMessage = cleanString(payload.personalMessage);

  if (!customerName) {
    return { error: "Customer name is required." };
  }

  if (!customerEmail || !isValidEmail(customerEmail)) {
    return { error: "A valid customer email address is required." };
  }

  if (!workCompleted) {
    return { error: "Type of work completed is required." };
  }

  return {
    data: {
      customerName,
      customerEmail,
      workCompleted,
      personalMessage,
    },
  };
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return Response.json(
      {
        message:
          "RESEND_API_KEY is missing. Add it to your environment before sending emails.",
      },
      { status: 500 },
    );
  }

  let payload: ReviewEmailRequest;

  try {
    payload = (await request.json()) as ReviewEmailRequest;
  } catch {
    return Response.json(
      { message: "Invalid request body. Please send valid JSON." },
      { status: 400 },
    );
  }

  const validated = validatePayload(payload);

  if ("error" in validated) {
    return Response.json({ message: validated.error }, { status: 400 });
  }

  const { customerName, customerEmail, workCompleted, personalMessage } =
    validated.data;
  const resend = new Resend(resendApiKey);

  // Email images are loaded from public assets such as logo.png, google.png, and logos-checkatrade.png.
  // Set NEXT_PUBLIC_SITE_URL in production if request origin is not the public site URL.
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin.replace(/\/$/, "");

  try {
    const emailHtml = await render(
      createElement(ReviewEmail, {
        customerName,
        workCompleted,
        personalMessage,
        baseUrl,
      }),
    );

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: SUBJECT,
      html: emailHtml,
    });

    if (error) {
      return Response.json(
        { message: error.message || "Resend could not send the email." },
        { status: 502 },
      );
    }

    return Response.json({
      message: `Review email sent to ${customerEmail}.`,
    });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while sending the email.",
      },
      { status: 500 },
    );
  }
}
