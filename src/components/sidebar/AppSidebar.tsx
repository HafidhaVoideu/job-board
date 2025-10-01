import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebarClient from "./_AppSidebarClient";
// import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@/services/clerk/components/SigninStatus";

export default function AppSidebar({
  footerButton,
  content,
  children,
}: {
  content: React.ReactNode;
  footerButton: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="oveflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex flex-row">
            <SidebarTrigger></SidebarTrigger>
            <span className="text-xl text-nowrap">Dream jobs</span>
          </SidebarHeader>

          <SidebarContent>{content}</SidebarContent>

          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  {footerButton}
                  {/* <SidebarUserButton></SidebarUserButton> */}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>

        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
