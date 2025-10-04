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
import { getJobListingOrganizationTag } from "@/features/jobListing/db/cache/jobListings";
import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { count } from "console";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUsersPermissions";
import { AsyncIf } from "@/components/AsyncIf";
import { db } from "@/drizzle/db";

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

            <AsyncIf
              condition={() => hasOrgUserPermission("org:job_listings:create")}
            >
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href="/employer/job-listings/new">
                  <PlusIcon /> <span className="sr-only">Add Job Listing</span>
                </Link>
              </SidebarGroupAction>
            </AsyncIf>
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

async function getJobListings(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JobListingApplicationTable.userId),
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.organizationId, orgId))
    .leftJoin(
      JobListingApplicationTable,
      eq(JobListingTable.id, JobListingApplicationTable.jobListingId)
    )
    .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.createdAt));

  data.forEach((jobListing) => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id));
  });

  return data;
}
