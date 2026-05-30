import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="page-shell">
      <section className="auth-shell">
        <div className="auth-card">
          <p className="eyebrow">New member signup</p>
          <h1>Use your league&apos;s signup link</h1>
          <p className="auth-copy">
            Your league organizer creates groups and invite codes in Admin. Ask them for the signup link for your group
            (for example <code>/l/your-league/signup</code>) and the invite code to enter there.
          </p>
          <div className="auth-footer">
            <p className="auth-switch">Already have an account?</p>
            <Link className="auth-secondary" href="/login">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
