"use server";
import z from "zod";
import { redirect } from "next/navigation";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
} from "../db/jobListings";
import { jobListingSchema } from "./schemas";
import { getJobListingIdTag } from "../db/cache/jobListings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUsersPermissions";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null || !(await hasOrgUserPermission("org:job_listings:create")))
    return {
      error: true,
      message: "you don't have permission to create a job listing.",
    };

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success)
    return {
      error: true,
      message: "There was an error creating your job listing.",
    };

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const updatedJobListing = await updateJobListingDb(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
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
