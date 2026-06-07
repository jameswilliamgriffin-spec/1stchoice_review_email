"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type FormValues = {
  customerName: string;
  customerEmail: string;
  workCompleted: string;
  personalMessage: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  customerName: "",
  customerEmail: "",
  workCompleted: "",
  personalMessage: "",
};

const googleReviewUrl =
  "https://search.google.com/local/writereview?placeid=ChIJ73dnpHG5cEgRG6LT16AuR0E";
const checkatradeUrl =
  "https://www.checkatrade.com/trades/1stchoiceroofingandbuildingltd";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.customerName.trim()) {
    errors.customerName = "Enter the customer's name.";
  }

  if (!values.customerEmail.trim()) {
    errors.customerEmail = "Enter the customer's email address.";
  } else if (!validateEmail(values.customerEmail)) {
    errors.customerEmail = "Enter a valid email address.";
  }

  if (!values.workCompleted.trim()) {
    errors.workCompleted = "Add the type of work completed.";
  }

  return errors;
}

export default function Home() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [isSending, setIsSending] = useState(false);

  const preview = useMemo(
    () => ({
      customerName: values.customerName.trim() || "Sophie Hughes",
      workCompleted: values.workCompleted.trim() || "flat roof extension",
      personalMessage:
        values.personalMessage.trim() ||
        "It was a pleasure working with you. The team really enjoyed it.",
      customerEmail: values.customerEmail.trim() || "sophie.hughes@email.com",
    }),
    [values],
  );

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus({ type: "idle", message: "" });

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before sending.",
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/send-review-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "The email could not be sent.");
      }

      setStatus({
        type: "success",
        message: `Review email sent to ${values.customerEmail.trim()}.`,
      });
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while sending the email.",
      });
    } finally {
      setIsSending(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-[15px] text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition placeholder:text-zinc-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/10";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 rounded-[2rem] border border-zinc-200/80 bg-white/88 px-4 py-3 shadow-[0_16px_50px_rgba(20,20,20,0.06)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Change the main app logo by replacing public/logo.png. */}
              <Image
                src="/logo.png"
                alt="1st Choice Roofers"
                width={230}
                height={46}
                priority
                className="h-auto w-48 sm:w-56"
              />
              <div className="hidden h-8 w-px bg-zinc-200 sm:block" />
              <p className="hidden text-[28px] font-semibold leading-[46px] text-zinc-950 md:block">
                Review request platform
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Ready to send
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(560px,1.1fr)] lg:items-start lg:py-14">
          <div className="space-y-7">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 shadow-sm">
                Internal tool for 1st Choice Roofers
              </div>
              <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-zinc-950 sm:text-6xl">
                Send review emails with ease
              </h1>
              <p className="mt-5 max-w-2xl text-xl leading-9 text-zinc-600">
                Enter the customer details, refine the message, and preview a
                branded email before sending it securely through Resend.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-zinc-200/80 bg-white p-5 shadow-[0_22px_70px_rgba(20,20,20,0.08)] sm:p-7"
            >
              <div className="mb-8 flex items-start justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-semibold tracking-normal">
                    Customer details
                  </h2>
                  <p className="mt-2 text-sm font-medium text-red-600">
                    Prepare email
                  </p>
                </div>
                <Image
                  src="/logo_icon.png"
                  alt=""
                  width={32}
                  height={32}
                  className="mt-1 h-8 w-8 rounded-xl opacity-80"
                />
              </div>

              <div className="grid gap-5">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-700">
                    Customer Name
                  </span>
                  <input
                    className={inputClass}
                    value={values.customerName}
                    onChange={(event) =>
                      updateValue("customerName", event.target.value)
                    }
                    placeholder="Sophie Hughes"
                    autoComplete="name"
                  />
                  {errors.customerName && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.customerName}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-700">
                    Customer Email Address
                  </span>
                  <input
                    className={inputClass}
                    value={values.customerEmail}
                    onChange={(event) =>
                      updateValue("customerEmail", event.target.value)
                    }
                    placeholder="sophie.hughes@email.com"
                    autoComplete="email"
                    inputMode="email"
                  />
                  {errors.customerEmail && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.customerEmail}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-700">
                    Type of Work Completed
                  </span>
                  <input
                    className={inputClass}
                    value={values.workCompleted}
                    onChange={(event) =>
                      updateValue("workCompleted", event.target.value)
                    }
                    placeholder="Flat roof extension"
                  />
                  {errors.workCompleted && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.workCompleted}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-700">
                    Optional Personal Message
                  </span>
                  <textarea
                    className={`${inputClass} min-h-36 resize-y leading-7`}
                    value={values.personalMessage}
                    onChange={(event) =>
                      updateValue("personalMessage", event.target.value)
                    }
                    placeholder="It was a pleasure working with you, Sophie. The team really enjoyed it."
                  />
                  <p className="mt-2 text-sm text-zinc-500">
                    This appears above the review buttons.
                  </p>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-4 text-base font-semibold text-white shadow-[0_16px_34px_rgba(220,38,38,0.20)] transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_20px_44px_rgba(220,38,38,0.24)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSending ? "Sending..." : "Send Review Email"}
                {isSending ? (
                  <Image
                    src="/logo_icon.png"
                    alt=""
                    width={20}
                    height={20}
                    className="animate-pulse rounded-full"
                  />
                ) : (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.25 10H14.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.75 5.75L15 10L10.75 14.25"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {status.type !== "idle" && (
                <div
                  className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    status.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                  role="status"
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-3 shadow-[0_24px_80px_rgba(20,20,20,0.08)] sm:p-4">
              <div className="flex items-center justify-between px-3 py-3">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Email preview
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {preview.customerEmail}
                  </p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-600">
                  Live
                </span>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-[#fbfbfa]">
                <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-5 py-4">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <p className="ml-3 truncate text-sm text-zinc-500">
                    Thank you from 1st Choice Roofers
                  </p>
                </div>

                <div className="border-b border-zinc-200 bg-white px-6 py-4 text-sm">
                  <div className="grid gap-1 sm:grid-cols-[72px_1fr]">
                    <span className="text-zinc-400">From</span>
                    <span>1st Choice Roofers &lt;reviews@1stchoiceroofers.uk&gt;</span>
                    <span className="text-zinc-400">To</span>
                    <span>{preview.customerEmail}</span>
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:p-6">
                  <section className="rounded-[1.5rem] border border-zinc-200 bg-white p-7 text-center">
                    <Image
                      src="/logo.png"
                      alt="1st Choice Roofers"
                      width={240}
                      height={48}
                      className="mx-auto h-auto w-56"
                    />
                    <h3 className="mx-auto mt-8 max-w-md text-4xl font-semibold leading-tight tracking-normal">
                      Thank you for choosing{" "}
                      <span className="text-red-600">1st Choice Roofers</span>
                    </h3>
                    <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-zinc-700">
                      Hi {preview.customerName}, thank you again for choosing
                      us. It was a pleasure helping with your{" "}
                      <span className="font-medium text-zinc-950">
                        {preview.workCompleted}
                      </span>
                      .
                    </p>
                  </section>

                  <section className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 text-center">
                    <p className="mx-auto max-w-md text-base leading-7 text-zinc-700">
                      {preview.personalMessage}
                    </p>
                    <p className="mx-auto mt-5 max-w-md text-base leading-7 text-zinc-700">
                      As a family-run business, Google reviews make a huge
                      difference to us and help future customers feel confident
                      they are choosing a trusted roofing company.
                    </p>
                  </section>

                  <section className="rounded-[1.5rem] border border-blue-100 bg-[#f3f8ff] p-7 text-center shadow-[0_18px_48px_rgba(21,93,252,0.08)]">
                    <Image
                      src="/google.png"
                      alt="Google Reviews"
                      width={200}
                      height={100}
                      unoptimized
                      className="mx-auto h-auto w-48"
                    />
                    <h4 className="mx-auto mt-6 max-w-md text-3xl font-semibold leading-tight tracking-normal">
                      Help Other Homeowners Choose With Confidence
                    </h4>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
                      A small review helps local homeowners find a reliable
                      roofing team.
                    </p>
                    <a
                      href={googleReviewUrl}
                      className="mt-6 inline-flex rounded-2xl bg-[#155dfc] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,93,252,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0f4fd6]"
                    >
                      Leave A Google Review
                    </a>
                  </section>

                  <section className="rounded-[1.5rem] border border-zinc-200 bg-[#f8f8f6] p-6 text-center shadow-[0_14px_38px_rgba(23,23,23,0.05)]">
                    <Image
                      src="/logos-checkatrade.png"
                      alt="Checkatrade"
                      width={192}
                      height={98}
                      unoptimized
                      className="mx-auto h-auto w-48"
                    />
                    <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-zinc-600">
                      <span className="font-bold text-zinc-950">
                        Already use Checkatrade?
                      </span>{" "}
                      We&apos;d be grateful for your feedback there too.
                    </p>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                      Some homeowners prefer to read reviews on Checkatrade when
                      choosing a trusted local roofer.
                    </p>
                    <a
                      href={checkatradeUrl}
                      className="mt-4 inline-flex rounded-2xl border border-zinc-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:text-red-600 hover:shadow-md"
                    >
                      Review us on Checkatrade
                    </a>
                  </section>

                  <section className="border-t-2 border-red-600 bg-white px-6 py-8 text-center">
                    <Image
                      src="/logo.png"
                      alt="1st Choice Roofers"
                      width={220}
                      height={44}
                      className="mx-auto h-auto w-52"
                    />
                    <div className="mt-6 text-sm leading-6 text-zinc-500">
                      <p>Kind regards,</p>
                      <p className="font-medium text-zinc-900">
                        Richard &amp; the team
                      </p>
                      <p>1st Choice Roofers</p>
                    </div>
                    <div className="mt-5 text-sm leading-6 text-zinc-500">
                      <p>Birmingham: 0121 623 7200</p>
                      <p>info@1stchoiceroofers.uk</p>
                    </div>
                    <p className="mt-5 text-xs font-medium text-zinc-500">
                      Fully insured • Family-run business • 30+ years
                      experience
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
