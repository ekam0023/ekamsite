"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase, supabaseIsConfigured } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "ekamsingh0023@gmail.com";

type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string;
  budget: string;
  message: string;
};

type ViewState = "checking" | "signed_out" | "denied" | "signed_in";

export default function AdminPage() {
  const [view, setView] = useState<ViewState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!supabaseIsConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applySession(session?.user.email ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  function applySession(sessionEmail: string | null) {
    if (!sessionEmail) {
      setView("signed_out");
      return;
    }
    if (sessionEmail.toLowerCase() !== ADMIN_EMAIL) {
      setView("denied");
      return;
    }
    setView("signed_in");
  }

  useEffect(() => {
    if (view !== "signed_in") return;

    setLoadError("");
    supabase
      .from("project_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setLoadError("Couldn't load submissions — " + error.message);
          return;
        }
        setInquiries((data as Inquiry[]) ?? []);
      });
  }, [view]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      setAuthError("Wrong email or password.");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setEmail("");
    setPassword("");
  }

  if (!supabaseIsConfigured) {
    return (
      <Shell>
        <p className="text-mist">
          Supabase isn&apos;t connected yet — add your environment variables
          first.
        </p>
      </Shell>
    );
  }

  if (view === "checking") {
    return (
      <Shell>
        <p className="text-mist">Checking session…</p>
      </Shell>
    );
  }

  if (view === "denied") {
    return (
      <Shell>
        <p className="font-display text-xl text-ink">
          This account can&apos;t view inquiries.
        </p>
        <p className="mt-2 text-sm text-mist">
          Only {ADMIN_EMAIL} has access to this page.
        </p>
        <button onClick={handleSignOut} className="button-ghost mt-6">
          Sign in with a different account
        </button>
      </Shell>
    );
  }

  if (view === "signed_in") {
    return (
      <Shell>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-ink">Inquiries</h1>
          <button onClick={handleSignOut} className="button-ghost">
            Sign out
          </button>
        </div>

        {loadError && (
          <p className="mt-6 text-sm text-red-300">{loadError}</p>
        )}

        {!loadError && inquiries.length === 0 && (
          <p className="mt-10 text-mist">
            No submissions yet — they&apos;ll show up here as people fill out
            the contact form.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-2xl border border-edge bg-glass p-6 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-display text-lg text-ink">
                  {inquiry.name}
                </p>
                <p className="text-xs text-haze">
                  {new Date(inquiry.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-beam">{inquiry.email}</p>
              {inquiry.phone && (
                <p className="text-sm text-mist">{inquiry.phone}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-mist">
                <span className="rounded-full border border-edge px-3 py-1">
                  {inquiry.project_type}
                </span>
                <span className="rounded-full border border-edge px-3 py-1">
                  {inquiry.budget}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                {inquiry.message}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="font-display text-2xl text-ink">Admin sign in</h1>
      <form onSubmit={handleSignIn} className="mt-8 max-w-sm space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-mist">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-mist">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field"
            autoComplete="current-password"
          />
        </label>

        {authError && <p className="text-sm text-red-300">{authError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-3xl">{children}</div>

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
        .button-ghost {
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: transparent;
          padding: 0.5rem 1.1rem;
          font-size: 0.85rem;
          color: #f4f7fa;
          transition: border-color 0.15s ease;
        }
        .button-ghost:hover {
          border-color: rgba(143, 227, 240, 0.6);
        }
      `}</style>
    </main>
  );
}
