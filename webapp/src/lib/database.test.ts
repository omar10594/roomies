// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Use a unique temp file per test run to avoid conflicts
const TEST_DB_DIR = path.resolve("/tmp", "roomies-test");
const TEST_DB_PATH = path.resolve(TEST_DB_DIR, `roomies-test-${Date.now()}-${Math.random().toString(36).slice(2)}.db`);

let db: Database.DB | null = null;

function getTestDb(): Database.DB {
  if (!db) {
    if (!fs.existsSync(TEST_DB_DIR)) {
      fs.mkdirSync(TEST_DB_DIR, { recursive: true });
    }
    // Remove old test db if exists
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    db = new Database(TEST_DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

function resetDb(): void {
  if (db) {
    db.close();
    db = null;
  }
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

function seedData(db: Database.DB): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roommates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      avatar TEXT,
      share_percentage INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      paid_by TEXT NOT NULL,
      date TEXT NOT NULL,
      split_evenly INTEGER NOT NULL DEFAULT 1,
      split_percentages TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paid_by) REFERENCES roommates(id)
    );
    CREATE TABLE IF NOT EXISTS rent_payments (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      month TEXT NOT NULL,
      paid_by TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paid_by) REFERENCES roommates(id)
    );
    CREATE TABLE IF NOT EXISTS chores (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      assigned_to TEXT NOT NULL,
      frequency TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      assigned_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES roommates(id)
    );
  `);

  const insertRoommate = db.prepare(
    "INSERT INTO roommates (id, name, email, share_percentage) VALUES (?, ?, ?, ?)"
  );
  insertRoommate.run("r1", "Alex Johnson", "alex@example.com", 50);
  insertRoommate.run("r2", "Sam Rivera", "sam@example.com", 50);

  const insertExpense = db.prepare(
    "INSERT INTO expenses (id, title, amount, category, paid_by, date, split_evenly) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  insertExpense.run("e1", "Monthly rent - June 2026", 2400, "rent", "r1", "2026-06-01", 1);
  insertExpense.run("e2", "Electric bill", 85, "utilities", "r2", "2026-06-10", 1);
  insertExpense.run("e3", "Groceries - weekly shop", 127.5, "groceries", "r1", "2026-06-15", 1);
  insertExpense.run("e4", "Internet bill", 60, "internet", "r2", "2026-06-05", 1);
  insertExpense.run("e5", "Cleaning supplies", 32.99, "cleaning", "r1", "2026-06-18", 1);

  const insertRent = db.prepare(
    "INSERT INTO rent_payments (id, amount, month, paid_by, date) VALUES (?, ?, ?, ?, ?)"
  );
  insertRent.run("rp1", 2400, "2026-06", "r1", "2026-06-01");
  insertRent.run("rp2", 2400, "2026-05", "r2", "2026-05-01");
  insertRent.run("rp3", 2400, "2026-04", "r1", "2026-04-02");

  const insertChore = db.prepare(
    "INSERT INTO chores (id, title, assigned_to, frequency, completed, assigned_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  insertChore.run("c1", "Take out trash", "r1", "weekly", 0, "2026-06-20");
  insertChore.run("c2", "Clean bathroom", "r2", "weekly", 1, "2026-06-13");
  insertChore.run("c3", "Vacuum living room", "r1", "biweekly", 0, "2026-06-15");
  insertChore.run("c4", "Mop kitchen floor", "r2", "weekly", 0, "2026-06-20");
  insertChore.run("c5", "Wipe kitchen counters", "r1", "daily", 1, "2026-06-26");
}

// --- Roommates ---

describe("Roommates API", () => {
  beforeEach(() => {
    resetDb();
    const db = getTestDb();
    seedData(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("gets all roommates", () => {
    const db = getTestDb();
    const rows = db.prepare("SELECT * FROM roommates ORDER BY name ASC").all();
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("name");
  });

  it("gets a roommate by id", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM roommates WHERE id = ?").get("r1") as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row?.name).toBe("Alex Johnson");
  });

  it("returns undefined for non-existent roommate", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM roommates WHERE id = ?").get("nonexistent");
    expect(row).toBeUndefined();
  });

  it("creates a new roommate", () => {
    const db = getTestDb();
    const id = `rm_${Date.now()}`;
    db.prepare("INSERT INTO roommates (id, name, email, share_percentage) VALUES (?, ?, ?, ?)")
      .run(id, "Test User", "test@example.com", 33);

    const rows = db.prepare("SELECT * FROM roommates").all();
    expect(rows).toHaveLength(3);
  });

  it("updates a roommate", () => {
    const db = getTestDb();
    db.prepare("UPDATE roommates SET name = ? WHERE id = ?").run("Alex J.", "r1");
    const row = db.prepare("SELECT * FROM roommates WHERE id = ?").get("r1") as Record<string, unknown>;
    expect(row?.name).toBe("Alex J.");
  });

  it("deletes a roommate", () => {
    const db = getTestDb();
    // Remove FK references first to avoid foreign key constraint errors
    db.prepare("DELETE FROM expenses WHERE paid_by = ?").run("r2");
    db.prepare("DELETE FROM rent_payments WHERE paid_by = ?").run("r2");
    db.prepare("DELETE FROM chores WHERE assigned_to = ?").run("r2");
    db.prepare("DELETE FROM roommates WHERE id = ?").run("r2");
    const rows = db.prepare("SELECT * FROM roommates").all();
    expect(rows).toHaveLength(1);
  });
});

// --- Expenses ---

describe("Expenses API", () => {
  beforeEach(() => {
    resetDb();
    const db = getTestDb();
    seedData(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("gets all expenses", () => {
    const db = getTestDb();
    const rows = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveProperty("title");
    expect(rows[0]).toHaveProperty("amount");
  });

  it("gets an expense by id", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM expenses WHERE id = ?").get("e1") as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row?.title).toBe("Monthly rent - June 2026");
  });

  it("returns undefined for non-existent expense", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM expenses WHERE id = ?").get("nonexistent");
    expect(row).toBeUndefined();
  });

  it("creates a new expense", () => {
    const db = getTestDb();
    const id = `exp_${Date.now()}`;
    db.prepare(
      "INSERT INTO expenses (id, title, amount, category, paid_by, date, split_evenly) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(id, "Pizza night", 45, "other", "r1", "2026-06-25", 1);

    const rows = db.prepare("SELECT * FROM expenses").all();
    expect(rows).toHaveLength(6);
  });

  it("updates an expense", () => {
    const db = getTestDb();
    db.prepare("UPDATE expenses SET amount = ? WHERE id = ?").run(2500, "e1");
    const row = db.prepare("SELECT * FROM expenses WHERE id = ?").get("e1") as Record<string, unknown>;
    expect(row?.amount).toBe(2500);
  });

  it("deletes an expense", () => {
    const db = getTestDb();
    db.prepare("DELETE FROM expenses WHERE id = ?").run("e5");
    const rows = db.prepare("SELECT * FROM expenses").all();
    expect(rows).toHaveLength(4);
  });
});

// --- Rent Payments ---

describe("Rent Payments API", () => {
  beforeEach(() => {
    resetDb();
    const db = getTestDb();
    seedData(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("gets all rent payments", () => {
    const db = getTestDb();
    const rows = db.prepare("SELECT * FROM rent_payments ORDER BY date DESC").all();
    expect(rows).toHaveLength(3);
  });

  it("gets a rent payment by id", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM rent_payments WHERE id = ?").get("rp1") as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row?.amount).toBe(2400);
  });

  it("returns undefined for non-existent payment", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM rent_payments WHERE id = ?").get("nonexistent");
    expect(row).toBeUndefined();
  });

  it("creates a new rent payment", () => {
    const db = getTestDb();
    const id = `rp_${Date.now()}`;
    db.prepare(
      "INSERT INTO rent_payments (id, amount, month, paid_by, date) VALUES (?, ?, ?, ?, ?)"
    ).run(id, 2400, "2026-07", "r2", "2026-07-01");

    const rows = db.prepare("SELECT * FROM rent_payments").all();
    expect(rows).toHaveLength(4);
  });

  it("updates a rent payment", () => {
    const db = getTestDb();
    db.prepare("UPDATE rent_payments SET amount = ? WHERE id = ?").run(2500, "rp1");
    const row = db.prepare("SELECT * FROM rent_payments WHERE id = ?").get("rp1") as Record<string, unknown>;
    expect(row?.amount).toBe(2500);
  });

  it("deletes a rent payment", () => {
    const db = getTestDb();
    db.prepare("DELETE FROM rent_payments WHERE id = ?").run("rp3");
    const rows = db.prepare("SELECT * FROM rent_payments").all();
    expect(rows).toHaveLength(2);
  });
});

// --- Chores ---

describe("Chores API", () => {
  beforeEach(() => {
    resetDb();
    const db = getTestDb();
    seedData(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("gets all chores", () => {
    const db = getTestDb();
    const rows = db.prepare("SELECT * FROM chores ORDER BY assigned_at DESC").all();
    expect(rows).toHaveLength(5);
  });

  it("gets a chore by id", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM chores WHERE id = ?").get("c1") as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row?.title).toBe("Take out trash");
  });

  it("returns undefined for non-existent chore", () => {
    const db = getTestDb();
    const row = db.prepare("SELECT * FROM chores WHERE id = ?").get("nonexistent");
    expect(row).toBeUndefined();
  });

  it("creates a new chore", () => {
    const db = getTestDb();
    const id = `ch_${Date.now()}`;
    db.prepare(
      "INSERT INTO chores (id, title, assigned_to, frequency, completed, assigned_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, "Water plants", "r1", "weekly", 0, "2026-06-27");

    const rows = db.prepare("SELECT * FROM chores").all();
    expect(rows).toHaveLength(6);
  });

  it("updates a chore", () => {
    const db = getTestDb();
    db.prepare("UPDATE chores SET completed = ? WHERE id = ?").run(1, "c1");
    const row = db.prepare("SELECT * FROM chores WHERE id = ?").get("c1") as Record<string, unknown>;
    expect(row?.completed).toBe(1);
  });

  it("deletes a chore", () => {
    const db = getTestDb();
    db.prepare("DELETE FROM chores WHERE id = ?").run("c5");
    const rows = db.prepare("SELECT * FROM chores").all();
    expect(rows).toHaveLength(4);
  });
});

// --- Dashboard Aggregates ---

describe("Dashboard Summary", () => {
  beforeEach(() => {
    resetDb();
    const db = getTestDb();
    seedData(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("returns dashboard summary with correct totals", () => {
    const db = getTestDb();
    const roommates = db.prepare("SELECT * FROM roommates").all();
    const expenses = db.prepare("SELECT * FROM expenses").all();
    const rentPayments = db.prepare("SELECT * FROM rent_payments").all();
    const chores = db.prepare("SELECT * FROM chores").all();

    const totalExpenses = expenses.reduce((sum: number, e: Record<string, unknown>) => sum + (e.amount as number), 0);
    const totalRent = rentPayments.reduce((sum: number, p: Record<string, unknown>) => sum + (p.amount as number), 0);
    const completedChores = chores.filter((c: Record<string, unknown>) => Boolean(c.completed)).length;
    const pendingChores = chores.filter((c: Record<string, unknown>) => !Boolean(c.completed)).length;
    const uniqueRentMonths = new Set(rentPayments.map((p: Record<string, unknown>) => p.month as string)).size;

    expect(totalExpenses).toBeGreaterThan(0);
    expect(totalRent).toBeGreaterThan(0);
    expect(roommates).toHaveLength(2);
    expect(completedChores + pendingChores).toBe(chores.length);
    expect(uniqueRentMonths).toBe(3);
  });

  it("calculates correct balances per roommate", () => {
    const db = getTestDb();
    const roommates = db.prepare("SELECT * FROM roommates").all();
    const expenses = db.prepare("SELECT * FROM expenses").all();

    const balances = roommates.map((roommate: Record<string, unknown>) => {
      const paid = expenses
        .filter((e: Record<string, unknown>) => e.paid_by === roommate.id)
        .reduce((sum: number, e: Record<string, unknown>) => sum + (e.amount as number), 0);
      const share = expenses.reduce((sum: number, e: Record<string, unknown>) => {
        if (e.split_evenly) return sum + (e.amount as number) * ((roommate.share_percentage as number) / 100);
        return sum;
      }, 0);
      return { id: roommate.id, paid, share, balance: paid - share };
    });

    expect(balances).toHaveLength(2);
    const alex = balances.find((b: Record<string, unknown> & { id: string }) => b.id === "r1");
    const sam = balances.find((b: Record<string, unknown> & { id: string }) => b.id === "r2");
    expect(alex).toBeDefined();
    expect(sam).toBeDefined();
    expect(alex!.paid).toBeTypeOf("number");
    expect(sam!.paid).toBeTypeOf("number");
  });
});
