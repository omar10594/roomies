import { NextResponse } from "next/server";
import { getAllExpenses, createExpense } from "@/lib/database";

export async function GET() {
  try {
    const expenses = getAllExpenses();
    return NextResponse.json(expenses);
  } catch {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, category, paidBy, date, splitEvenly, splitPercentages } = body;

    if (!title || amount === undefined || !paidBy || !date) {
      return NextResponse.json(
        { error: "Title, amount, paidBy, and date are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const validCategories = ["rent", "utilities", "groceries", "internet", "phone", "cleaning", "other"];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const expense = createExpense({
      title,
      amount,
      category: category ?? "other",
      paidBy,
      date,
      splitEvenly,
      splitPercentages,
    });
    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
