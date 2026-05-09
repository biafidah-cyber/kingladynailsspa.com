import { NextResponse } from "next/server";
import {
  isSupabaseEnabled,
  dbGetAllSubscribers,
  dbGetAllContacts,
  dbGetAllComments,
} from "@/lib/db";
import { localGetAllSubscribers, localGetAllContacts, localGetAllComments } from "@/lib/localDb";

/** Admin-only: returns all subscribers, contacts, and blog comments */
export async function GET(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const [subscribers, contacts, comments] = await Promise.all([
    isSupabaseEnabled() ? dbGetAllSubscribers() : Promise.resolve(localGetAllSubscribers()),
    isSupabaseEnabled() ? dbGetAllContacts()    : Promise.resolve(localGetAllContacts()),
    isSupabaseEnabled() ? dbGetAllComments()    : Promise.resolve(localGetAllComments()),
  ]);

  return NextResponse.json({ subscribers, contacts, comments });
}
