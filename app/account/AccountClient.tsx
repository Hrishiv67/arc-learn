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

  if (loading)
    return (
      <Container className="py-12">
        <p role="status">Loading your account…</p>
      </Container>
    );

  if (user) {
    return (
      <Container className="py-8 md:py-12">
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px]">
          Your account
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-12 mt-8 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <Callout tone="go" title={`Signed in as ${user.email}`}>
              Your progress is saved on this device and syncs while connected.
            </Callout>
            <WhatWeStore />
          </div>
          <aside className="bg-mist-300 p-5 md:p-6 flex flex-col gap-5">
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
    <Container className="py-8 md:py-12">
      <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px]">
        Save your progress
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-12 mt-8 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          <Callout
            tone="info"
            title={`${doneCount} of ${MODULES.length} modules complete`}
          >
            Saved on this device right now. An account keeps it in sync across
            devices — it is never required to use the course.
          </Callout>
          <WhatWeStore />
        </div>

        <aside className="bg-mist-300 p-5 md:p-6">
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
      <h2 className="font-heading font-bold text-arc-navy text-[22px]">
        {mode === "signup" ? "Create an account" : "Sign in"}
      </h2>
      <Callout tone="info" title="Ask a parent or teacher first">
        You do not need an account to use the course.
      </Callout>
      {notice && (
        <p role="status" className="text-info">
          {notice}
        </p>
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
      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting
          ? "Working…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </Button>
      <TextButton
        type="button"
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError(null);
          setNotice(null);
        }}
      >
        {mode === "signup"
          ? "Already have an account? Sign in"
          : "New here? Create an account"}
      </TextButton>
      <TextButton type="button" onClick={() => router.push("/modules")}>
        Continue without an account
      </TextButton>
    </form>
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
