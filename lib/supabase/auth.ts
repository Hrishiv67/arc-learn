import { createClient } from "./client";

/**
 * Email + password, magic link, and Google.
 *
 * This file previously allowed no OAuth at all, on the reasoning that a course
 * aimed at middle-schoolers should collect nothing beyond what a student typed.
 * Google sign-in was added deliberately, as a second option rather than a
 * replacement: the email-and-password path stays first and stays sufficient, so
 * nobody needs a Google account to take the course.
 *
 * Note that an account is now required before Module 1, which means this app
 * collects an email address from students who may be under 13. COPPA applies to
 * that. There is no age gate here yet.
 */

export async function signUpWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
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
 * Google OAuth. Returns to `redirectTo` (usually /auth/callback) which exchanges
 * the code for a session. Requires the Google provider to be enabled in the
 * Supabase dashboard; until it is, callers should keep the button hidden.
 */
export async function signInWithGoogle(redirectTo: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
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
