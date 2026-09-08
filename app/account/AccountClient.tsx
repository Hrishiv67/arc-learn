"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MODULES } from "@/content/modules/registry";
import { useProgress } from "@/lib/progress/local";
import { isModuleComplete } from "@/lib/schemas/progress";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { Button, TextButton } from "@/components/ui/Button";

/**
 * Tier 2 — optional account. Email + password only, nothing else. No real
 * Supabase project is connected yet (see lib/supabase) — this screen
 * demonstrates the flow and copy; it does not create a real account.
 */
export function AccountClient() {
  const router = useRouter();
  const progress = useProgress();
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doneCount = MODULES.filter((m) =>
    isModuleComplete(progress[m.id]),
  ).length;

  if (signedIn) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12">
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px]">
          Your account
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-12 mt-8 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <Callout
              tone="go"
              title={`Signed in as ${email || "you@example.com"}`}
            >
              Your progress syncs to every device you sign in on, once a real
              account backend is connected.
            </Callout>
            <WhatWeStore />
          </div>
          <aside className="bg-mist-300 p-5 md:p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-arc-navy text-[22px]">
              Signed in
            </h2>
            <Button variant="outline" onClick={() => setSignedIn(false)}>
              Sign out
            </Button>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12">
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
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSignedIn(true);
            }}
          >
            <h2 className="font-heading font-bold text-arc-navy text-[22px]">
              Create an account
            </h2>
            <Callout tone="info" title="Ask a parent or teacher first">
              You do not need an account to use the course.
            </Callout>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" fullWidth>
              Create account
            </Button>
            <TextButton onClick={() => router.push("/modules")}>
              Continue without an account
            </TextButton>
          </form>
        </aside>
      </div>
    </div>
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
