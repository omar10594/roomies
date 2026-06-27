import { NextResponse } from "next/server";
import { getRentPaymentById, updateRentPayment, deleteRentPayment } from "@/lib/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payment = getRentPaymentById(id);
    if (!payment) {
      return NextResponse.json({ error: "Rent payment not found" }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch {
    return NextResponse.json({ error: "Failed to fetch rent payment" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payment = updateRentPayment(id, body);
    if (!payment) {
      return NextResponse.json({ error: "Rent payment not found" }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch {
    return NextResponse.json({ error: "Failed to update rent payment" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteRentPayment(id);
    if (!deleted) {
      return NextResponse.json({ error: "Rent payment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete rent payment" }, { status: 500 });
  }
}
