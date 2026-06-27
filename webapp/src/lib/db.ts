import {
  MOCK_ROOMMATES,
  MOCK_EXPENSES,
  MOCK_RENT_PAYMENTS,
  MOCK_CHORES,
} from "./data";
import type { AppState, Roommate, Expense, RentPayment, ChoresTask } from "./data";

let _state: AppState | null = null;

function getState(): AppState {
  if (!_state) {
    _state = {
      roommates: [...MOCK_ROOMMATES],
      expenses: [...MOCK_EXPENSES],
      rentPayments: [...MOCK_RENT_PAYMENTS],
      chores: [...MOCK_CHORES],
    };
  }
  return _state;
}

// --- Roommates ---

export function getAllRoommates(): Roommate[] {
  return [...getState().roommates].sort((a, b) => a.name.localeCompare(b.name));
}

export function getRoommateById(id: string): Roommate | undefined {
  return getState().roommates.find((r) => r.id === id);
}

export function createRoommate(input: {
  name: string;
  email?: string;
  avatar?: string;
  sharePercentage: number;
}): Roommate {
  const state = getState();
  const id = `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const roommate: Roommate = {
    id,
    name: input.name,
    email: input.email,
    avatar: input.avatar,
    sharePercentage: input.sharePercentage,
  };
  state.roommates.push(roommate);
  return roommate;
}

export function updateRoommate(id: string, input: {
  name?: string;
  email?: string;
  avatar?: string;
  sharePercentage?: number;
}): Roommate | undefined {
  const state = getState();
  const idx = state.roommates.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  state.roommates[idx] = { ...state.roommates[idx], ...input };
  return state.roommates[idx];
}

export function deleteRoommate(id: string): boolean {
  const state = getState();
  const idx = state.roommates.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  state.roommates.splice(idx, 1);
  return true;
}

// --- Expenses ---

export function getAllExpenses(): Expense[] {
  return [...getState().expenses].sort((a, b) => b.date.localeCompare(a.date));
}

export function getExpenseById(id: string): Expense | undefined {
  return getState().expenses.find((e) => e.id === id);
}

export function createExpense(input: {
  title: string;
  amount: number;
  category: Expense["category"];
  paidBy: string;
  date: string;
  splitEvenly?: boolean;
  splitPercentages?: Record<string, number>;
}): Expense {
  const state = getState();
  const id = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const expense: Expense = {
    id,
    title: input.title,
    amount: input.amount,
    category: input.category,
    paidBy: input.paidBy,
    date: input.date,
    splitEvenly: input.splitEvenly !== false,
    splitPercentages: input.splitPercentages,
  };
  state.expenses.push(expense);
  return expense;
}

export function updateExpense(id: string, input: {
  title?: string;
  amount?: number;
  category?: Expense["category"];
  paidBy?: string;
  date?: string;
  splitEvenly?: boolean;
  splitPercentages?: Record<string, number>;
}): Expense | undefined {
  const state = getState();
  const idx = state.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  state.expenses[idx] = { ...state.expenses[idx], ...input };
  return state.expenses[idx];
}

export function deleteExpense(id: string): boolean {
  const state = getState();
  const idx = state.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  state.expenses.splice(idx, 1);
  return true;
}

// --- Rent Payments ---

export function getAllRentPayments(): RentPayment[] {
  return [...getState().rentPayments].sort((a, b) => b.date.localeCompare(a.date));
}

export function getRentPaymentById(id: string): RentPayment | undefined {
  return getState().rentPayments.find((r) => r.id === id);
}

export function createRentPayment(input: {
  amount: number;
  month: string;
  paidBy: string;
  date: string;
}): RentPayment {
  const state = getState();
  const id = `rp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const payment: RentPayment = { id, ...input };
  state.rentPayments.push(payment);
  return payment;
}

export function updateRentPayment(id: string, input: {
  amount?: number;
  month?: string;
  paidBy?: string;
  date?: string;
}): RentPayment | undefined {
  const state = getState();
  const idx = state.rentPayments.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  state.rentPayments[idx] = { ...state.rentPayments[idx], ...input };
  return state.rentPayments[idx];
}

export function deleteRentPayment(id: string): boolean {
  const state = getState();
  const idx = state.rentPayments.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  state.rentPayments.splice(idx, 1);
  return true;
}

// --- Chores ---

export function getAllChores(): ChoresTask[] {
  return [...getState().chores].sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
}

export function getChoreById(id: string): ChoresTask | undefined {
  return getState().chores.find((c) => c.id === id);
}

export function createChore(input: {
  title: string;
  assignedTo: string;
  frequency: ChoresTask["frequency"];
  assignedAt: string;
}): ChoresTask {
  const state = getState();
  const id = `ch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const chore: ChoresTask = {
    id,
    title: input.title,
    assignedTo: input.assignedTo,
    frequency: input.frequency,
    completed: false,
    assignedAt: input.assignedAt,
  };
  state.chores.push(chore);
  return chore;
}

export function updateChore(id: string, input: {
  title?: string;
  assignedTo?: string;
  frequency?: ChoresTask["frequency"];
  completed?: boolean;
  completedAt?: string | null;
  assignedAt?: string;
}): ChoresTask | undefined {
  const state = getState();
  const idx = state.chores.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const existing = state.chores[idx];
  const updated: ChoresTask = {
    ...existing,
    ...input,
    completedAt: input.completedAt !== null ? input.completedAt : existing.completedAt,
  };
  if (input.completed !== undefined && input.completed && !existing.completed) {
    updated.completedAt = new Date().toISOString().slice(0, 10);
  }
  state.chores[idx] = updated;
  return updated;
}

export function deleteChore(id: string): boolean {
  const state = getState();
  const idx = state.chores.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  state.chores.splice(idx, 1);
  return true;
}

// --- Dashboard Aggregates ---

export interface DashboardSummary {
  totalExpenses: number;
  totalRent: number;
  uniqueRentMonths: number;
  completedChores: number;
  pendingChores: number;
  choresCompletionRate: number;
  balances: Array<{ id: string; name: string; paid: number; share: number; balance: number }>;
  totalOwed: number;
  totalToReceive: number;
}

export function getDashboardSummary(): DashboardSummary {
  const state = getState();
  const roommates = state.roommates;
  const expensesList = state.expenses;
  const rentPaymentsList = state.rentPayments;
  const choresList = state.chores;

  const totalExpenses = expensesList.reduce((sum, e) => sum + e.amount, 0);
  const totalRent = rentPaymentsList.reduce((sum, p) => sum + p.amount, 0);
  const uniqueRentMonths = new Set(rentPaymentsList.map((p) => p.month)).size;
  const completedChores = choresList.filter((c) => c.completed).length;
  const pendingChores = choresList.filter((c) => !c.completed).length;
  const choresCompletionRate = choresList.length > 0 ? Math.round((completedChores / choresList.length) * 100) : 0;

  const balances = roommates.map((roommate) => {
    const paid = expensesList
      .filter((e) => e.paidBy === roommate.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const share = expensesList.reduce((sum, e) => {
      if (e.splitEvenly) return sum + e.amount * (roommate.sharePercentage / 100);
      return sum;
    }, 0);
    return {
      id: roommate.id,
      name: roommate.name,
      paid,
      share,
      balance: paid - share,
    };
  });

  const totalOwed = balances.reduce((sum, b) => sum + (b.balance < 0 ? Math.abs(b.balance) : 0), 0);
  const totalToReceive = balances.reduce((sum, b) => sum + (b.balance > 0 ? b.balance : 0), 0);

  return {
    totalExpenses,
    totalRent,
    uniqueRentMonths,
    completedChores,
    pendingChores,
    choresCompletionRate,
    balances,
    totalOwed,
    totalToReceive,
  };
}
