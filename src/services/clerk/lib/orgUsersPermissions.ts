import { auth } from "@clerk/nextjs/server";

type UserPermission =
  | "org:job_listings:create"
  | "job_listings:update"
  | "org:job_listings:delete"
  | "org:job_listings:update"
  | "org:job_listings:change_status"
  | "org:job_listing_applications:applicant_change_rating"
  | "org:job_listing_applications:applicant_change_stage";

export async function hasOrgUserPermission(permission: UserPermission) {
  console.log("permissions inside function:", permission);
  const { has } = await auth();

  console.log("has:", has({ permission }));
  return has({ permission });
}
