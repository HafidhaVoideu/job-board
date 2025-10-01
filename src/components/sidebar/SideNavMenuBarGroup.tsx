"use client";
import React from "react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedIn, SignedOut } from "@/services/clerk/components/SigninStatus";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SideNavMenuBarGroup({
  items,
  className,
}: {
  items: {
    href: string;
    icon: React.ReactNode;
    label: string;
    authStatus?: "signedIn" | "signedOut";
  }[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {/* this only appears if user is not logged in */}

        {items.map((item, index) => {
          const html = (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild isActive={item.href === pathname}>
                <Link href={item.href}>
                  {item.icon}
                  <span> {item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
          if (item.authStatus === "signedOut") {
            return <SignedOut key={item.href}>{html}</SignedOut>;
          }

          if (item.authStatus === "signedIn") {
            return <SignedIn key={item.href}>{html}</SignedIn>;
          }

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default SideNavMenuBarGroup;
