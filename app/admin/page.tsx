export const dynamic = "force-dynamic";

import { AdminPortal } from "@/components/AdminPortal";
import { Header } from "@/components/Header";
import { getAdminDashboardData } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/user";

export default async function AdminPage() {
  const user = await requireAdmin();
  const dashboard = await getAdminDashboardData();

  return (
    <main className="page-shell">
      <Header currentUserName={user.displayName} isAdmin variant="admin" />
      <AdminPortal currentUserId={user.id} users={dashboard.users} />
    </main>
  );
}
