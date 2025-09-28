import { DeletedObjectJSON, UserJSON } from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";

type ClerkWebbhookData<T> = {
  data: {
    data: T;
    raw: string;
    headers: Record<string, string>;
  };
};

type EventType = {
  "clerk/user.created": ClerkWebbhookData<UserJSON>;
  "clerk/user.updated": ClerkWebbhookData<UserJSON>;
  "clerk/user.deleted": ClerkWebbhookData<DeletedObjectJSON>;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-board",
  schemas: new EventSchemas().fromRecord<EventType>(),
});
