import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", service: "eventhub-uz", version: "0.1.0-alpha.1", timestamp: new Date().toISOString() });
}
