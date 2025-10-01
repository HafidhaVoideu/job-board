import AppSidebar from "@/components/sidebar/AppSidebar";
import SideNavMenuBarGroup from "@/components/sidebar/SideNavMenuBarGroup";
import { SidebarUserButton } from "@/features/user/components/SidebarUserButton";
import { BrainCircuitIcon, ClipboardListIcon } from "lucide-react";

export default function jobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar
      content={
        <SideNavMenuBarGroup
          className="mt-auto"
          items={[
            {
              href: "/",
              icon: <ClipboardListIcon></ClipboardListIcon>,
              label: "job board",
            },
            {
              href: "/ai-search",
              icon: <BrainCircuitIcon></BrainCircuitIcon>,
              label: "AI search",
            },
            {
              href: "/employer",
              icon: <ClipboardListIcon></ClipboardListIcon>,
              label: "Employer dashboard",
              authStatus: "signedIn",
            },
            {
              href: "/sign-in",
              icon: <ClipboardListIcon></ClipboardListIcon>,
              label: "Employer dashboard",
              authStatus: "signedOut",
            },
          ]}
        ></SideNavMenuBarGroup>
      }
      footerButton={<SidebarUserButton></SidebarUserButton>}
    >
      {children}
    </AppSidebar>
  );
}
