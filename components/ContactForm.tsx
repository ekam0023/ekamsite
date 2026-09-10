"use client";

import { useState, type FormEvent } from "react";
import { supabase, supabaseIsConfigured } from "@/lib/supabaseClient";

type Status = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "New website",
  "Redesign",
  "Ongoing changes",
  "Not sure yet",
];

const budgets = ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "Let's talk"];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    if (!supabaseIsConfigured) {
      setStatus("error");
      setErrorMessage(
        "This form isn't connected yet — add your Supabase keys as environment variables to enable it."
      );
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || null,
      project_type: String(data.get("project_type") ?? ""),
      budget: String(data.get("budget") ?? ""),
      message: String(data.get("message") ?? "").trim(),
    };

    const { error } = await supabase.from("project_inquiries").insert([payload]);

    if (error) {
      setStatus("error");
      setErrorMessage(
        "That didn't go through. Please try again, or email us directly."
      );
      return;
    }

    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-edge bg-glass p-8 text-center backdrop-blur-md sm:p-10">
        <p className="font-display text-xl text-ink">Message sent.</p>
        <p className="mt-2 text-sm text-mist">
          We read every message ourselves and reply within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-edge bg-glass p-6 backdrop-blur-md sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="field"
            placeholder="Your name"
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field"
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone (optional)" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="field"
            placeholder="Optional"
          />
        </Field>

        <Field label="Project type" htmlFor="project_type">
          <select
            id="project_type"
            name="project_type"
            required
            defaultValue=""
            className="field"
          >
            <option value="" disabled>
              Choose one
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Budget" htmlFor="budget">
          <select
            id="budget"
            name="budget"
            required
            defaultValue=""
            className="field"
          >
            <option value="" disabled>
              Choose a range
            </option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Tell us about the project" htmlFor="message">
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="field resize-none"
            placeholder="What are you building, and for whom?"
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-300">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>

      <style jsx global>{`
        .field {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.03);
          padding: 0.65rem 0.9rem;
          font-size: 0.925rem;
          color: #f4f7fa;
        }
        .field::placeholder {
          color: #5d6a7a;
        }
        .field:focus {
          border-color: rgba(143, 227, 240, 0.6);
        }
        select.field option {
          color: #0a0a0a;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-sm text-mist">{label}</span>
      {children}
    </label>
  );
}

export default ContactForm;
