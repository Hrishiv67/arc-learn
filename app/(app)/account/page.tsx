import type { Metadata } from "next";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string; next?: string }>;
}) {
  const { auth_error, next } = await searchParams;
  return (
    <>
      {auth_error && (
        <p
          role="alert"
          className="bg-caution-tint text-caution p-4 text-center"
        >
          That confirmation link could not be verified. Try signing in, or
          request a new confirmation email.
        </p>
      )}
      <AccountClient next={next} />
    </>
  );
}
