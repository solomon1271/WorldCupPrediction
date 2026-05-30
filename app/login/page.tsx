import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getPostLoginRedirectPath } from "@/lib/auth/post-login-redirect";
import { getCurrentUser } from "@/lib/auth/user";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(await getPostLoginRedirectPath(user));
  }

  return <AuthForm mode="login" />;
}
