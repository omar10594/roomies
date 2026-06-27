// Re-export the in-memory data layer for backward compatibility.
// The original better-sqlite3 implementation has been replaced with
// an in-memory store using mock data for Vercel serverless compatibility.
import type { Expense, ChoresTask } from "./data";

export {
  getAllRoommates,
  getRoommateById,
  createRoommate,
  updateRoommate,
  deleteRoommate,
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getAllRentPayments,
  getRentPaymentById,
  createRentPayment,
  updateRentPayment,
  deleteRentPayment,
  getAllChores,
  getChoreById,
  createChore,
  updateChore,
  deleteChore,
  getDashboardSummary,
} from "./db";

export interface CreateRoommateInput {
  name: string;
  email?: string;
  avatar?: string;
  sharePercentage: number;
}

export interface UpdateRoommateInput {
  name?: string;
  email?: string;
  avatar?: string;
  sharePercentage?: number;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category: Expense["category"];
  paidBy: string;
  date: string;
  splitEvenly?: boolean;
  splitPercentages?: Record<string, number>;
}

export interface UpdateExpenseInput {
  title?: string;
  amount?: number;
  category?: Expense["category"];
  paidBy?: string;
  date?: string;
  splitEvenly?: boolean;
  splitPercentages?: Record<string, number>;
}

export interface CreateRentPaymentInput {
  amount: number;
  month: string;
  paidBy: string;
  date: string;
}

export interface UpdateRentPaymentInput {
  amount?: number;
  month?: string;
  paidBy?: string;
  date?: string;
}

export interface CreateChoreInput {
  title: string;
  assignedTo: string;
  frequency: ChoresTask["frequency"];
  assignedAt: string;
}

export interface UpdateChoreInput {
  title?: string;
  assignedTo?: string;
  frequency?: ChoresTask["frequency"];
  completed?: boolean;
  completedAt?: string | null;
  assignedAt?: string;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalRent: number;
  uniqueRentMonths: number;
  completedChores: number;
  pendingChores: number;
  choresCompletionRate: number;
  balances: Array<{
    id: string;
    name: string;
    paid: number;
    share: number;
    balance: number;
  }>;
  totalOwed: number;
  totalToReceive: number;
}
