import AppSidebar from "@/components/sidebar/AppSidebar";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarOrganizationButton } from "@/features/organization/components/SidebarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { ClipboardListIcon, Link, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";

import SideNavMenuBarGroup from "@/components/sidebar/SideNavMenuBarGroup";
import { ReactNode, Suspense } from "react";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  );
}

async function LayoutSuspense({ children }: { children: ReactNode }) {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return redirect("/organizations/select");

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job Listings</SidebarGroupLabel>

            <SidebarGroupAction title="Add Job Listing" asChild>
              <Link href="/employer/job-listings/new">
                <PlusIcon /> <span className="sr-only">Add Job Listing</span>
              </Link>
            </SidebarGroupAction>
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              {/* <Suspense>
                <JobListingMen orgId={orgId} />
              </Suspense> */}
            </SidebarGroupContent>
          </SidebarGroup>
          <SideNavMenuBarGroup
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
            ]}
          />
        </>
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
}
