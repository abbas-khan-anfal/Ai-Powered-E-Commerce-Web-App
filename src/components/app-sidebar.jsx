"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  Store,
  User,
  TerminalIcon,
  TableOfContents,
} from "lucide-react";

import useAdminAuthStore from "@/store/useAdminAuthStore";

export function AppSidebar({ ...props }) {
  const { dashboardUser } = useAdminAuthStore();

  const navMain = React.useMemo(() => {
    const items = [
      {
        title: "Inventory",
        url: "#",
        icon: <Store />,
        isActive: true,
        items: [
          {
            title: "Products",
            url: "/dashboard/products",
          },
          {
            title: "Add Product",
            url: "/dashboard/products/add-product",
          },
          {
            title: "Categories",
            url: "/dashboard/products/categories",
          },
          {
            title: "Add Category",
            url: "/dashboard/products/categories/add-category",
          },
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: <TableOfContents />,
      }
    ];

    // Admin Routes
    if (dashboardUser?.role === "admin") {
      items.push({
        title: "Users",
        url: "#",
        icon: <User />,
        isActive: true,
        items: [
          {
            title: "Users",
            url: "/dashboard/users",
          },
          {
            title: "Add User",
            url: "/dashboard/users/add-user",
          },
        ],
      });
    }
    // console.log(dashboardUser);

    return items;
  }, [dashboardUser]);

  const data = {
    user: {
      name: dashboardUser?.username,
      email: dashboardUser?.email,
      avatar: dashboardUser?.avatar,
    },

    teams: [
      {
        name: "E-shop",
        logo: <GalleryVerticalEndIcon />,
        plan: "Dashboard",
      }
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}