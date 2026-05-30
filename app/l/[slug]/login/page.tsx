import { notFound, redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getPostLoginRedirectPath } from "@/lib/auth/post-login-redirect";
import { getCurrentUser } from "@/lib/auth/user";
import { getLeagueBySlug } from "@/lib/leagues";

type LeagueLoginPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LeagueLoginPage({ params }: LeagueLoginPageProps) {
  const { slug } = await params;
  const league = await getLeagueBySlug(slug);

  if (!league) {
    notFound();
  }

  const user = await getCurrentUser();

  if (user) {
    redirect(await getPostLoginRedirectPath(user, slug));
  }

  return <AuthForm mode="login" league={league} />;
}
