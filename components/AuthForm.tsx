"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "Private league access"}</p>
        <h1>{mode === "login" ? "Sign in to your picks dashboard" : "Create your account for the group"}</h1>
        <p className="auth-copy">
          {mode === "login"
            ? "Use the account you created for this private World Cup challenge."
            : "Only people with the invite code can join this prediction league."}
        </p>
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const payload =
              mode === "login"
                ? {
                    email: String(formData.get("email") || ""),
                    password: String(formData.get("password") || "")
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
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });

              const result = (await response.json()) as { error?: string };

              if (!response.ok) {
                setError(result.error || (mode === "login" ? "Could not sign in." : "Could not create account."));
                return;
              }

              router.push("/");
              router.refresh();
            });
          }}
        >
          {mode === "signup" ? (
            <label>
              <span>Display name</span>
              <input name="displayName" type="text" placeholder="Solomon" required />
            </label>
          ) : null}
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" placeholder="At least 8 characters" required />
          </label>
          {mode === "signup" ? (
            <label>
              <span>Invite code</span>
              <input name="inviteCode" type="text" placeholder="League invite code" required />
            </label>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="auth-footer">
          <p className="auth-switch">{mode === "login" ? "Need an account?" : "Already in the group?"}</p>
          <Link className="auth-secondary" href={mode === "login" ? "/signup" : "/login"}>
            {mode === "login" ? "Create one" : "Sign in"}
          </Link>
        </div>
      </div>
    </section>
  );
}
