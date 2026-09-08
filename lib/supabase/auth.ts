import { createClient } from "./client";
import { mergeLocalProgressOnSignUp } from "@/lib/progress/sync";

/**
 * Email + password and magic-link auth only — no OAuth, no third-party
 * identity providers (nothing that could fingerprint a minor beyond what
 * they typed). Never run against a live project in this build.
 */

export async function signUpWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) await mergeLocalProgressOnSignUp(data.user.id);
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

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
