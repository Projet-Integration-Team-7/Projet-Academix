import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import { createChatUser } from "@/lib/actions/chat.actions";
import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

type EventType =
| "user.created"
| "organization.created"
| "organizationInvitation.created"
| "organizationMembership.created"
| "organizationMembership.deleted"
| "organization.updated"
| "organization.deleted";

type Event = {
data: Record<string, string | number | Record<string, string>[]>;
object: "event";
type: EventType;
};

export const POST = async (request: Request) => {
console.log("Webhook received");
const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("Missing webhook secret");
  return NextResponse.json({ message: "Missing webhook secret" }, { status: 500 });
}

const payload = await request.json();
const header = headers();
const heads: IncomingHttpHeaders & WebhookRequiredHeaders = {
  "svix-id": header.get("svix-id") ?? "",
  "svix-timestamp": header.get("svix-timestamp") ?? "",
  "svix-signature": header.get("svix-signature") ?? "",
};

const wh = new Webhook(WEBHOOK_SECRET);

let evnt: Event | null = null;

try {
  evnt = wh.verify(JSON.stringify(payload), heads) as Event;
} catch (err) {
  console.error("Error verifying webhook:", err);
  return NextResponse.json({ message: err }, { status: 400 });
}

const eventType: EventType = evnt?.type!;

console.log("Event type", eventType);

if (eventType === "user.created") {
  const { id, username, email_addresses, first_name, last_name } = evnt?.data;

  try {
    await createChatUser({
      username,
      id: id.toString(),
      email_address: email_addresses[0].email_address,
      first_name,
      last_name,
    });

    return NextResponse.json({ message: "Chat user created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

if (eventType === "organization.created") {
  const { id, name, slug, logo_url, image_url, created_by } = evnt?.data ?? {};

  try {
    await createCommunity(id, name, slug, logo_url || image_url, "org bio", created_by);

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

if (eventType === "organizationInvitation.created") {
  try {
    console.log("Invitation created", evnt?.data);

    return NextResponse.json({ message: "Invitation created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

if (eventType === "organizationMembership.created") {
  try {
    const { organization, public_user_data } = evnt?.data;
    console.log("created", evnt?.data);

    const organizationId = typeof organization === 'string' ? organization : organization[0].id;

    await addMemberToCommunity(organizationId, public_user_data.user_id);

    return NextResponse.json({ message: "Invitation accepted" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

if (eventType === "organizationMembership.deleted") {
  try {
    const { organization, public_user_data } = evnt?.data;
    console.log("removed", evnt?.data);

    await removeUserFromCommunity(public_user_data.user_id, (organization as unknown as { id: string }).id);

    return NextResponse.json({ message: "Member removed" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

if (eventType === "organization.updated") {
  try {
    const { id, logo_url, name, slug } = evnt?.data;
    console.log("updated", evnt?.data);

    await updateCommunityInfo(id.toString(), name, slug, logo_url);

    return NextResponse.json({ message: "Member removed" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

if (eventType === "organization.deleted") {
  try {
    const { id } = evnt?.data;
    console.log("deleted", evnt?.data);

    await deleteCommunity(id.toString());

    return NextResponse.json({ message: "Organization deleted" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

return NextResponse.json({ message: "Unsupported event" }, { status: 404 });
};
