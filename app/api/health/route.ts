import { NextResponse } from "next/server";
import packageMetadata from "@/package.json";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "marosim",
    version: packageMetadata.version,
    timestamp: new Date().toISOString(),
  });
}
