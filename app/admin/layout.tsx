import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = { title: "Administración | Casa Kruyff", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="ck-admin">{children}</div>;
}
