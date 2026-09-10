import { getUserAction } from "@/actions/user/getuser";
import Dashboard from "@/components/dashboard";

export const metadata = {
  title : "E-Shop | Dashboard",
  description : "Manage your dashboard"
}

export default async function DashboardLayout({ children }) {
  const res = await getUserAction();
  const user = res?.user ? res.user : null;
  return (
    <>
      <Dashboard user={user}>
        { children }
      </Dashboard>
    </>
  );
}