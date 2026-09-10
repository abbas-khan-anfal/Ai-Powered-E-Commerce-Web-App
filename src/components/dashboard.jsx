"use client";
import { getUserAction } from "@/actions/user/getuser";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { Spinner } from "./ui/spinner";
import useAdminAuthStore from "@/store/useAdminAuthStore";

export default function Dashboard({ user, children }) {
  const { setDashboardUser, dashboardUser } = useAdminAuthStore();

  useEffect(() => {
    if (user) {
      setDashboardUser(user);
    }
  }, [user]);

  return (
    <>
      {user ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="relative">
              <header className="border-b border-ring h-[50px] sticky top-0 left-0 right-0 flex justify-between items-center px-5 bg-background">
                <SidebarTrigger className="-ml-1" />
              </header>
              <section className="p-5">{children}</section>
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
