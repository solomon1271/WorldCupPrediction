"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { LeagueBranding } from "@/lib/league-types";

type AuthFormProps = {
  mode: "login" | "signup";
  league?: LeagueBranding;
};

export function AuthForm({ mode, league }: AuthFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const leagueName = league?.name || "World Cup Prediction";
  const redirectPath = league ? `/l/${league.slug}` : "/";

  return (
    <section className={mode === "login" ? "auth-shell auth-shell--login" : "auth-shell"}>
      {mode === "login" ? <div className="auth-shell__logo" aria-hidden="true" /> : null}
      <div className="auth-card">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "Private league access"}</p>
        <h1>{mode === "login" ? leagueName : `Create your account for ${leagueName}`}</h1>
        <p className="auth-copy">
          {mode === "login"
            ? `Use the account you created for ${leagueName}.`
            : "Only people with the invite code can join this prediction league."}
        </p>
        {league ? <p className="auth-copy">{league.subtitle}</p> : null}
        <form
          className="auth-form"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const payload =
              mode === "login"
                ? {
                    email: String(formData.get("email") || ""),
                    password: String(formData.get("password") || ""),
                    ...(league ? { leagueSlug: league.slug } : {})
                  }
                : {
                    displayName: String(formData.get("displayName") || ""),
                    email: String(formData.get("email") || ""),
                    password: String(formData.get("password") || ""),
                    inviteCode: String(formData.get("inviteCode") || "")
                  };

            startTransition(async () => {
              setError(null);

              const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });

              const raw = await response.text();
              let result: { error?: string; ok?: boolean; leagueSlug?: string; redirectPath?: string } = {};
              if (raw.trim()) {
                try {
                  result = JSON.parse(raw) as { error?: string; ok?: boolean; leagueSlug?: string; redirectPath?: string };
                } catch {
                  setError("The server returned an unexpected response. Please try again.");
                  return;
                }
              }

              if (!response.ok) {
                const code =
                  "code" in result && typeof (result as { code?: string }).code === "string"
                    ? ` (${(result as { code: string }).code})`
                    : "";
                setError((result.error || (mode === "login" ? "Could not sign in." : "Could not create account.")) + code);
                return;
              }

              const nextPath =
                result.redirectPath || (result.leagueSlug ? `/l/${result.leagueSlug}` : mode === "login" ? "/" : redirectPath);
              window.location.assign(nextPath);
            });
          }}
        >
          {mode === "signup" ? (
            <label>
              <span>Display name</span>
              <input name="displayName" type="text" placeholder="Your name" autoComplete="off" required />
            </label>
          ) : null}
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" autoComplete="off" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
          </label>
          {mode === "signup" ? (
            <label>
              <span>Invite code</span>
              <input name="inviteCode" type="text" placeholder="League invite code" autoComplete="off" required />
            </label>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="auth-footer">
          <p className="auth-switch">{mode === "login" ? "Need an account?" : "Already in the group?"}</p>
          <Link
            className="auth-secondary"
            href={league ? `/l/${league.slug}/${mode === "login" ? "signup" : "login"}` : mode === "login" ? "/signup" : "/login"}
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </Link>
        </div>
      </div>
    </section>
  );
}
