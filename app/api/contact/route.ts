import { NextResponse } from "next/server";
import { rateLimitAsync, getRateLimitIp } from "@/lib/rateLimit";
import { isSupabaseEnabled, dbSaveContact } from "@/lib/db";
import { localSaveContact } from "@/lib/localDb";

export async function POST(request: Request) {
  const ip = getRateLimitIp(request);
  if (!await rateLimitAsync(ip, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();

    const name:    unknown = body?.name;
    const email:   unknown = body?.email;
    const message: unknown = body?.message;

    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
    }

    const contact = {
      name:    name.trim().slice(0, 200),
      email:   email.toLowerCase().trim(),
      message: message.trim().slice(0, 5000),
    };

    if (isSupabaseEnabled()) {
      await dbSaveContact(contact);
    } else {
      localSaveContact(contact);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
