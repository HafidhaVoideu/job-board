import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserButtonSuspense />
    </Suspense>
  );
}

async function SidebarUserButtonSuspense() {
  const { userId } = await auth();

  return (
    <SidebarUserButtonClient
      user={{
        name: "hafidha bouabdelli",
        email: "hafidha@test.com",
        imageUrl: "/avatar.png",
      }}
    />
  );
}
