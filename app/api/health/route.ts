import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", service: "marosim", version: "0.1.0-alpha.2", timestamp: new Date().toISOString() });
}
