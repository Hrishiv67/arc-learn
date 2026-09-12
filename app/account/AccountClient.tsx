"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MODULES } from "@/content/modules/registry";
import { useProgress } from "@/lib/progress/local";
import { isModuleComplete } from "@/lib/schemas/progress";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import {
  signUpWithPassword,
  signInWithPassword,
  signOut,
  resendConfirmation,
} from "@/lib/supabase/auth";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { Button, TextButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RocketLoader } from "@/components/engagement/RocketLoader";

/**
 * Tier 2 — optional account. Email + password only, nothing else. Real
 * Supabase auth once a project is connected (see lib/supabase and
 * .env.example); with no project configured this screen still explains the
 * flow honestly rather than faking a sign-in.
 */
export function AccountClient() {
  const router = useRouter();
  const progress = useProgress();
  const { user, loading } = useSupabaseUser();
  const configured = isSupabaseConfigured();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const doneCount = MODULES.filter((m) =>
    isModuleComplete(progress[m.id]),
  ).length;

  if (loading) return <RocketLoader label="Finding your saved mission…" />;

  if (user) {
    return (
      <Container className="py-10 md:py-16">
        <p className="eyebrow">Mission control</p>
        <h1 className="font-heading font-bold text-arc-navy text-[34px] md:text-[48px] mt-2">
          Your progress is cleared for launch.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-12 mt-8 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <Callout tone="go" title={`Signed in as ${user.email}`}>
              Your progress is saved on this device and syncs while connected.
            </Callout>
            <WhatWeStore />
          </div>
          <aside className="auth-card flex flex-col gap-5">
            <h2 className="font-heading font-bold text-arc-navy text-[22px]">
              Signed in
            </h2>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await signOut();
                  router.push("/modules");
                } catch {
                  setSignOutError("Could not sign out. Please try again.");
                }
              }}
            >
              Sign out
            </Button>
            {signOutError && <p role="alert">{signOutError}</p>}
          </aside>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 md:py-16">
      <p className="eyebrow">Optional account</p>
      <h1 className="font-heading font-bold text-arc-navy text-[34px] md:text-[48px] mt-2 max-w-[17ch]">
        Take your progress with you.
      </h1>
      <p className="text-lg text-sky-800 mt-3 max-w-[54ch]">
        Start here, finish on another device, and keep your best quiz scores.
        Creating an account takes only an email and password.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_420px] gap-8 md:gap-14 mt-10 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          <AccountBenefits doneCount={doneCount} />
          <WhatWeStore />
        </div>

        <aside className="auth-card">
          {configured ? (
            <AuthForm onDone={() => router.push("/modules")} />
          ) : (
            <div className="flex flex-col gap-5">
              <h2 className="font-heading font-bold text-arc-navy text-[22px]">
                Keep learning on this device
              </h2>
              <Callout tone="info" title="Device progress is available">
                Account sync is not available right now. You can still read
                lessons, take quizzes, and save progress in this browser.
              </Callout>
              <TextButton onClick={() => router.push("/modules")}>
                Continue without an account
              </TextButton>
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}

function AuthForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const data = await signUpWithPassword(email, password);
        if (!data.session) {
          setNotice(
            "Check your email to confirm your account, then sign in. Your progress stays on this device.",
          );
          return;
        }
      } else {
        await signInWithPassword(email, password);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div
        className="auth-mode-switch"
        role="tablist"
        aria-label="Account action"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "is-active" : undefined}
          onClick={() => {
            setMode("signup");
            setError(null);
            setNotice(null);
          }}
        >
          Create account
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          className={mode === "signin" ? "is-active" : undefined}
          onClick={() => {
            setMode("signin");
            setError(null);
            setNotice(null);
          }}
        >
          Sign in
        </button>
      </div>
      <div>
        <h2 className="font-heading font-bold text-arc-navy text-[24px]">
          {mode === "signup" ? "Save this mission" : "Welcome back"}
        </h2>
        <p className="text-sm text-sky-800 mt-1">
          {mode === "signup"
            ? "No profile setup, username, or personal details."
            : "Continue from the last device you used."}
        </p>
      </div>
      {notice && (
        <Callout tone="go" title="Check your inbox">
          {notice}
        </Callout>
      )}
      {error && (
        <Callout tone="caution" title="Couldn't do that">
          {error}
        </Callout>
      )}
      {mode === "signin" && (
        <TextButton
          type="button"
          disabled={submitting || !email}
          onClick={async () => {
            setSubmitting(true);
            setError(null);
            try {
              await resendConfirmation(email);
              setNotice(
                "If your account needs confirmation, a new email is on its way.",
              );
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Could not send the email. Try again.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          Resend confirmation email
        </TextButton>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {mode === "signup" && (
        <p className="-mt-3 text-xs text-sky-800">
          Use at least 6 characters. Ask a parent or teacher before signing up.
        </p>
      )}
      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting
          ? "Working…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </Button>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <button
        type="button"
        className="text-sm font-semibold text-arc-navy underline underline-offset-4"
        onClick={() => router.push("/modules")}
      >
        Keep learning without an account
      </button>
    </form>
  );
}

function AccountBenefits({ doneCount }: { doneCount: number }) {
  const benefits = [
    ["Pick up anywhere", "Your reading and quiz progress follows you."],
    [
      "Keep your best score",
      "Retakes improve your record instead of replacing it.",
    ],
    ["Stay private", "We only need an email. No name, school, or photo."],
  ];
  return (
    <section aria-labelledby="account-benefits-title">
      <p className="eyebrow">Current flight log</p>
      <h2 id="account-benefits-title" className="text-2xl mt-2">
        {doneCount} of {MODULES.length} modules complete
      </h2>
      <div className="account-benefits mt-5">
        {benefits.map(([title, body], index) => (
          <div key={title} className="account-benefit">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-lg">{title}</h3>
              <p className="text-sm text-sky-800 mt-1">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatWeStore() {
  return (
    <div>
      <h2 className="font-heading font-bold text-arc-navy text-[22px] md:text-[28px]">
        What we store
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 mt-4">
        <div className="bg-mist-300 p-4">
          <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
            We store
          </span>
          <ul className="font-body text-[16px] text-arc-ink list-disc pl-5 mt-2.5 space-y-1.5">
            <li>Your email</li>
            <li>Modules completed</li>
            <li>Quiz scores</li>
          </ul>
        </div>
        <div className="sm:border-l sm:border-mist-600 sm:pl-5">
          <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-700">
            We never ask for
          </span>
          <ul className="font-body text-[16px] text-arc-ink list-disc pl-5 mt-2.5 space-y-1.5">
            <li>Your name</li>
            <li>Your date of birth</li>
            <li>Your school</li>
            <li>A photo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
