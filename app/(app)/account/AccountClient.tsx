"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import {
  signUpWithPassword,
  signInWithPassword,
  signInWithGoogle,
  signOut,
  resendConfirmation,
} from "@/lib/supabase/auth";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { Button, TextButton } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";

function safeNext(path?: string) {
  if (!path) return "/modules";
  if (!path.startsWith("/") || path.startsWith("//")) return "/modules";
  return path;
}

export function AccountClient({
  next,
  googleEnabled = false,
}: {
  next?: string;
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const { user, loading } = useSupabaseUser();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const continueHref = safeNext(next);
  if (loading) return <Loading label="Opening your account…" />;
  return (
    <section className="account-entry">
      <div className="account-entry__intro">
        <p className="eyebrow">ARC / LEARN</p>
        <h1>
          {user ? "Ready when you are." : "A little learning. A big launch."}
        </h1>
        <p>
          {user
            ? "Pick up where you left off."
            : "Create a free account to save your progress and build your rocket as you learn."}
        </p>
      </div>
      <div className="auth-card account-entry__form">
        {user ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl">You’re signed in.</h2>
            <Button href={continueHref} fullWidth>
              Continue to the course
            </Button>
            <TextButton
              tone="navy"
              onClick={async () => {
                try {
                  await signOut();
                  router.refresh();
                } catch {
                  setSignOutError("Could not sign out. Please try again.");
                }
              }}
            >
              Sign out
            </TextButton>
            {signOutError && (
              <Callout tone="caution" title="Try again">
                {signOutError}
              </Callout>
            )}
          </div>
        ) : isSupabaseConfigured() ? (
          <AuthForm
            googleEnabled={googleEnabled}
            nextPath={continueHref}
            onDone={() => {
              router.replace(continueHref);
              router.refresh();
            }}
          />
        ) : (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl">Start learning</h2>
            <p className="text-base text-sky-800">
              Account sync is unavailable here. Your progress will stay in this
              browser.
            </p>
            <Button href={continueHref}>Open the course</Button>
          </div>
        )}
        {!user && (
          <div className="mt-5 border-t border-mist-600 pt-5 text-center">
            <TextButton tone="navy" href={continueHref}>
              Continue without an account
            </TextButton>
          </div>
        )}
      </div>
    </section>
  );
}
function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.3z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.2-2.9.7-4.3v-5.7H4.5C2.9 17.2 2 20.5 2 24s.9 6.8 2.5 9.7l7.3-5.4z"
      />
      <path
        fill="#EA4335"
        d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8.1 6.8 4.5 14.3l7.3 5.7c1.7-5.2 6.5-9.3 12.2-9.3z"
      />
    </svg>
  );
}

function AuthForm({
  onDone,
  googleEnabled,
  nextPath,
}: {
  onDone: () => void;
  googleEnabled: boolean;
  nextPath: string;
}) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const callbackUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const data = await signUpWithPassword(email, password, callbackUrl);
        if (!data.session) {
          setNotice(
            "Open the confirmation link in your email to start the course.",
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
    <form
      className="flex flex-col gap-4"
      aria-busy={submitting}
      onSubmit={handleSubmit}
    >
      <div
        className="auth-mode-switch"
        role="group"
        aria-label="Account action"
      >
        <button
          type="button"
          aria-pressed={mode === "signup"}
          disabled={submitting}
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
          aria-pressed={mode === "signin"}
          disabled={submitting}
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
          {mode === "signup" ? "Create your free account" : "Welcome back"}
        </h2>
        <p className="text-sm text-sky-800 mt-1">
          {mode === "signup"
            ? "Save your progress. Pick up anytime."
            : "Your course and rocket are waiting."}
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
      {googleEnabled && (
        <>
          <button
            type="button"
            className="google-button"
            disabled={submitting}
            onClick={async () => {
              setError(null);
              setSubmitting(true);
              try {
                await signInWithGoogle(callbackUrl);
              } catch {
                setError(
                  "Google sign-in could not start. Try again or use email below.",
                );
                setSubmitting(false);
              }
            }}
          >
            <GoogleMark />
            Continue with Google
          </button>
          <p className="auth-divider">
            <span>or use an email address</span>
          </p>
        </>
      )}
      {!googleEnabled && (
        <Callout tone="info" title="Google sign-in">
          Email works now. Google appears here automatically once the Google
          provider is enabled on the project.
        </Callout>
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
      <div className="relative">
        <Input
          className="pr-20"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-2 bottom-1 min-h-11 px-3 text-sm font-semibold text-arc-navy"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {mode === "signup" && (
        <p className="-mt-3 text-xs text-sky-800">
          Use at least 6 characters. Ask a parent or teacher before signing up.
        </p>
      )}
      {mode === "signup" && (
        <p className="-mt-2 text-xs text-sky-800">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="underline text-arc-navy">
            Terms of Use
          </Link>
          .
        </p>
      )}
      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting
          ? "Working…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </Button>
      {(mode === "signin" || notice) && email.trim() && (
        <p className="-mt-2 text-center text-sm text-sky-800">
          Still waiting for your confirmation email?{" "}
          <TextButton
            tone="navy"
            type="button"
            disabled={submitting}
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
            Resend it
          </TextButton>
        </p>
      )}
    </form>
  );
}
