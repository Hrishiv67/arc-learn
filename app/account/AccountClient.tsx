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

  const doneCount = MODULES.filter((m) =>
    isModuleComplete(progress[m.id]),
  ).length;

  if (loading) return null;

  if (user) {
    return (
      <Container className="py-8 md:py-12">
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px]">
          Your account
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-12 mt-8 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <Callout tone="go" title={`Signed in as ${user.email}`}>
              Your progress syncs to every device you sign in on.
            </Callout>
            <WhatWeStore />
          </div>
          <aside className="bg-mist-300 p-5 md:p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-arc-navy text-[22px]">
              Signed in
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                signOut();
                router.push("/modules");
              }}
            >
              Sign out
            </Button>
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
                Accounts aren&apos;t connected yet
              </h2>
              <Callout tone="caution" title="No backend configured">
                This build hasn&apos;t been pointed at a Supabase project (see
                .env.example), so accounts are off. Progress still saves
                perfectly well on this device.
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signUpWithPassword(email, password);
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
      {error && (
        <Callout tone="caution" title="Couldn't do that">
          {error}
        </Callout>
      )}
      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        type="password"
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
