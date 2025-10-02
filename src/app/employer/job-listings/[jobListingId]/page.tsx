import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListingIdTag } from "@/features/joblistings/db/cache/jobListings";
import { formatJobListingStatus } from "@/features/joblistings/lib/formatters";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JobListingBadges } from "@/features/joblistings/components/JobListingBadges";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditIcon } from "lucide-react";
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
        <Button asChild variant="outline">
          <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
            <EditIcon className="size-4" />
            Edit
          </Link>
        </Button>
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
