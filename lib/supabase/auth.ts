import { createClient } from "./client";

/**
 * Email + password, confirmation resend, and Google OAuth.
 *
 * Email/password stays complete on its own. Google is a second path that only
 * appears when Supabase reports the Google provider as enabled (see
 * lib/supabase/providers.ts). Account sync is optional for reading lessons;
 * progress still works anonymously in localStorage when no backend is set.
 */

export async function signUpWithPassword(
  email: string,
  password: string,
  emailRedirectTo?: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        emailRedirectTo ?? `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithMagicLink(email: string, redirectTo: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

/**
 * Google OAuth. `redirectTo` should be an absolute /auth/callback URL
 * (optionally with ?next=). Requires the Google provider enabled in Supabase.
 */
export async function signInWithGoogle(redirectTo: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) throw error;
  if (data.url && typeof window !== "undefined") {
    window.location.assign(data.url);
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resendConfirmation(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}
