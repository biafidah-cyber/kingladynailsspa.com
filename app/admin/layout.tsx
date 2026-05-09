// Admin layout — only available in development mode
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminProviders from "./providers";

export const metadata = { title: "Admin — LeadHunter Site Builder" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Block admin in production for security
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  // If ADMIN_PASSWORD is set, require a valid session
  if (process.env.ADMIN_PASSWORD) {
    const session = await getServerSession();
    if (!session) {
      redirect("/login?callbackUrl=/admin");
    }
  }

  return (
    <AdminProviders>
      <div>
        <div className="bg-yellow-400 text-yellow-900 text-xs text-center py-1 font-medium">
          ⚠️ ADMIN MODE — This panel is disabled in production. Run locally only.
        </div>
        {children}
      </div>
    </AdminProviders>
  );
}
