import { NextResponse } from "next/server";
import { getChoreById, updateChore, deleteChore } from "@/lib/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chore = getChoreById(id);
    if (!chore) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }
    return NextResponse.json(chore);
  } catch {
    return NextResponse.json({ error: "Failed to fetch chore" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const chore = updateChore(id, body);
    if (!chore) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }
    return NextResponse.json(chore);
  } catch {
    return NextResponse.json({ error: "Failed to update chore" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteChore(id);
    if (!deleted) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete chore" }, { status: 500 });
  }
}
