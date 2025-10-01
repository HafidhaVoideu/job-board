import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
// import { UserTable } from "@/drizzle/schema";

// import { UserTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/user/db/cache/users";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { OrganizationTable, UserTable } from "@/drizzle/schema";
import { getOrganizationIdTag } from "@/features/organization/db/cache/organization";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId != null ? await getUser(userId) : undefined,
  };
}
export async function getCurrentOrganization({ allData = false } = {}) {
  const { orgId } = await auth();

  return {
    orgId,
    organization:
      allData && orgId != null ? await getOrganizationTag(orgId) : undefined,
  };
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
async function getOrganizationTag(id: string) {
  "use cache";
  cacheTag(getOrganizationIdTag(id));
  return db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  });
}
