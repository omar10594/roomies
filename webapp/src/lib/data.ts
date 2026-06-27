export type Roommate = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  sharePercentage: number; // 0-100
};

export type ExpenseCategory =
  | "rent"
  | "utilities"
  | "groceries"
  | "internet"
  | "phone"
  | "cleaning"
  | "other";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string; // roommate id
  date: string;
  splitEvenly: boolean;
  splitPercentages?: Record<string, number>;
};

export type RentPayment = {
  id: string;
  amount: number;
  month: string; // YYYY-MM
  paidBy: string; // roommate id
  date: string;
};

export type ChoresTask = {
  id: string;
  title: string;
  assignedTo: string; // roommate id
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  completed: boolean;
  completedAt?: string;
  assignedAt: string;
};

export type AppState = {
  roommates: Roommate[];
  expenses: Expense[];
  rentPayments: RentPayment[];
  chores: ChoresTask[];
};

export const MOCK_ROOMMATES: Roommate[] = [
  { id: "r1", name: "Alex Johnson", email: "alex@example.com", sharePercentage: 50 },
  { id: "r2", name: "Sam Rivera", email: "sam@example.com", sharePercentage: 50 },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: "e1",
    title: "Monthly rent - June 2026",
    amount: 2400,
    category: "rent",
    paidBy: "r1",
    date: "2026-06-01",
    splitEvenly: true,
  },
  {
    id: "e2",
    title: "Electric bill",
    amount: 85,
    category: "utilities",
    paidBy: "r2",
    date: "2026-06-10",
    splitEvenly: true,
  },
  {
    id: "e3",
    title: "Groceries - weekly shop",
    amount: 127.5,
    category: "groceries",
    paidBy: "r1",
    date: "2026-06-15",
    splitEvenly: true,
  },
  {
    id: "e4",
    title: "Internet bill",
    amount: 60,
    category: "internet",
    paidBy: "r2",
    date: "2026-06-05",
    splitEvenly: true,
  },
  {
    id: "e5",
    title: "Cleaning supplies",
    amount: 32.99,
    category: "cleaning",
    paidBy: "r1",
    date: "2026-06-18",
    splitEvenly: true,
  },
];

export const MOCK_RENT_PAYMENTS: RentPayment[] = [
  { id: "rp1", amount: 2400, month: "2026-06", paidBy: "r1", date: "2026-06-01" },
  { id: "rp2", amount: 2400, month: "2026-05", paidBy: "r2", date: "2026-05-01" },
  { id: "rp3", amount: 2400, month: "2026-04", paidBy: "r1", date: "2026-04-02" },
];

export const MOCK_CHORES: ChoresTask[] = [
  {
    id: "c1",
    title: "Take out trash",
    assignedTo: "r1",
    frequency: "weekly",
    completed: false,
    assignedAt: "2026-06-20",
  },
  {
    id: "c2",
    title: "Clean bathroom",
    assignedTo: "r2",
    frequency: "weekly",
    completed: true,
    completedAt: "2026-06-22",
    assignedAt: "2026-06-13",
  },
  {
    id: "c3",
    title: "Vacuum living room",
    assignedTo: "r1",
    frequency: "biweekly",
    completed: false,
    assignedAt: "2026-06-15",
  },
  {
    id: "c4",
    title: "Mop kitchen floor",
    assignedTo: "r2",
    frequency: "weekly",
    completed: false,
    assignedAt: "2026-06-20",
  },
  {
    id: "c5",
    title: "Wipe kitchen counters",
    assignedTo: "r1",
    frequency: "daily",
    completed: true,
    completedAt: "2026-06-26",
    assignedAt: "2026-06-26",
  },
];

export function getInitialState(): AppState {
  return {
    roommates: MOCK_ROOMMATES,
    expenses: MOCK_EXPENSES,
    rentPayments: MOCK_RENT_PAYMENTS,
    chores: MOCK_CHORES,
  };
}
