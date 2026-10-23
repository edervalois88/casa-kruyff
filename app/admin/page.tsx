import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { requireAdmin } from "@/lib/server/auth";

export default async function AdminPage() {
  await requireAdmin();
  return <AdminWorkspace />;
}
