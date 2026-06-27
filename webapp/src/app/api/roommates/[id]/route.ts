import { NextResponse } from "next/server";
import { getRoommateById, updateRoommate, deleteRoommate } from "@/lib/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roommate = getRoommateById(id);
    if (!roommate) {
      return NextResponse.json({ error: "Roommate not found" }, { status: 404 });
    }
    return NextResponse.json(roommate);
  } catch {
    return NextResponse.json({ error: "Failed to fetch roommate" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const roommate = updateRoommate(id, body);
    if (!roommate) {
      return NextResponse.json({ error: "Roommate not found" }, { status: 404 });
    }
    return NextResponse.json(roommate);
  } catch {
    return NextResponse.json({ error: "Failed to update roommate" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteRoommate(id);
    if (!deleted) {
      return NextResponse.json({ error: "Roommate not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete roommate" }, { status: 500 });
  }
}
