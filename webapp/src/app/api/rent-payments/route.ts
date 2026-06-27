import { NextResponse } from "next/server";
import { getAllRentPayments, createRentPayment } from "@/lib/database";

export async function GET() {
  try {
    const payments = getAllRentPayments();
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch rent payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, month, paidBy, date } = body;

    if (amount === undefined || !month || !paidBy || !date) {
      return NextResponse.json(
        { error: "Amount, month, paidBy, and date are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    const payment = createRentPayment({ amount, month, paidBy, date });
    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create rent payment" }, { status: 500 });
  }
}
