export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getPostLoginRedirectPath } from "@/lib/auth/post-login-redirect";
import { getCurrentUser } from "@/lib/auth/user";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(await getPostLoginRedirectPath(user));
}
