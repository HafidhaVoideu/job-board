import { db } from "@/drizzle/db";
import { JobListingStatus, JobListingTable } from "@/drizzle/schema";
import { getJobListingIdTag } from "@/features/joblistings/db/cache/jobListings";
import { formatJobListingStatus } from "@/features/joblistings/lib/formatters";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";

import { JobListingBadges } from "@/features/joblistings/components/JobListingBadges";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { AsyncIf } from "@/components/AsyncIf";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUsersPermissions";
import { getNextJobListingStatus } from "@/features/joblistings/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActionButton } from "@/components/ActionButton";
import { hasReachedMaxPublishedJobListings } from "@/features/joblistings/lib/planFeaturehelpers";
type Props = {
  params: Promise<{ jobListingId: string }>;
};
const JobListingId = ({ params }: Props) => {
  return (
    <Suspense>
      <SuspenseJobListing params={params} />
    </Suspense>
  );
};

export default JobListingId;

async function SuspenseJobListing({ params }: Props) {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return null;

  const { jobListingId } = await params;

  const jobListing = await getJobListing(jobListingId, orgId);

  console.log("joblistsing:", jobListing);

  if (jobListing == null) return notFound();

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>

            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>

        <AsyncIf
          condition={() => hasOrgUserPermission("org:job_listings:update")}
        >
          <Button asChild variant="outline">
            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
              <EditIcon className="size-4" />
              Edit
            </Link>
          </Button>
        </AsyncIf>
      </div>
      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />
    </div>
  );
}

function StatusUpdateButton({
  status,
  id,
}: {
  status: JobListingStatus;
  id: string;
}) {
  const button = (
    <Button variant="outline" disabled>
      {statusToggleButtonText(status)}
    </Button>
  );
  // const button = (
  //   <ActionButton
  //     action={toggleJobListingStatus.bind(null, id)}
  //     variant="outline"
  //     requireAreYouSure={getNextJobListingStatus(status) === "published"}
  //     areYouSureDescription="This will immediately show this job listing to all users."
  //   >
  //     {statusToggleButtonText(status)}
  //   </ActionButton>
  // );

  return (
    <AsyncIf
      condition={() => hasOrgUserPermission("org:job_listings:change_status")}
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxPublishedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={statusToggleButtonText(status)}
              popoverText="You must upgrade your plan to publish more job listings."
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
}

function UpgradePopover({
  buttonText,
  popoverText,
}: {
  buttonText: ReactNode;
  popoverText: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {popoverText}
        <Button asChild>
          <Link href="/employer/pricing">Upgrade Plan</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function statusToggleButtonText(status: JobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      );
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
}
async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}
