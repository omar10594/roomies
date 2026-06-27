import { NextResponse } from "next/server";
import { getAllRoommates, createRoommate } from "@/lib/database";

export async function GET() {
  try {
    const roommates = getAllRoommates();
    return NextResponse.json(roommates);
  } catch {
    return NextResponse.json({ error: "Failed to fetch roommates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, avatar, sharePercentage } = body;

    if (!name || sharePercentage === undefined) {
      return NextResponse.json(
        { error: "Name and sharePercentage are required" },
        { status: 400 }
      );
    }

    if (typeof sharePercentage !== "number" || sharePercentage < 0 || sharePercentage > 100) {
      return NextResponse.json(
        { error: "sharePercentage must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    const roommate = createRoommate({ name, email, avatar, sharePercentage });
    return NextResponse.json(roommate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create roommate" }, { status: 500 });
  }
}
