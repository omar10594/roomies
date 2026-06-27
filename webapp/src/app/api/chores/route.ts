import { NextResponse } from "next/server";
import { getAllChores, createChore } from "@/lib/database";

export async function GET() {
  try {
    const chores = getAllChores();
    return NextResponse.json(chores);
  } catch {
    return NextResponse.json({ error: "Failed to fetch chores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, assignedTo, frequency, assignedAt } = body;

    if (!title || !assignedTo || !frequency || !assignedAt) {
      return NextResponse.json(
        { error: "Title, assignedTo, frequency, and assignedAt are required" },
        { status: 400 }
      );
    }

    const validFrequencies = ["daily", "weekly", "biweekly", "monthly"];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: "Invalid frequency. Must be daily, weekly, biweekly, or monthly" },
        { status: 400 }
      );
    }

    const chore = createChore({ title, assignedTo, frequency, assignedAt });
    return NextResponse.json(chore, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create chore" }, { status: 500 });
  }
}
