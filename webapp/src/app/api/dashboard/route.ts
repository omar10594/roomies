import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/database";

export async function GET() {
  try {
    const summary = getDashboardSummary();
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
