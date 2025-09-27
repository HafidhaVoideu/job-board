import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebarClient } from "./_AppSidebarClient";
// import { SignedOut } from "@clerk/nextjs";
import { SignedOut } from "@/services/clerk/components/SigninStatus";
import { Link, LogInIcon } from "lucide-react";
import { SidebarUserButton } from "@/features/user/components/SidebarUserButton";

export default function Home() {
  return (
    <SidebarProvider className="oveflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex flex-row">
            <SidebarTrigger></SidebarTrigger>
            <span className="text-xl text-nowrap">Dream jobs</span>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {/* this only appears if user is not logged in */}

                <SignedOut>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/sign-in">
                        <LogInIcon></LogInIcon>
                        <span> sign in</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedOut>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarUserButton></SidebarUserButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1"></main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
