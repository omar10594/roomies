import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const roommates = sqliteTable("roommates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  avatar: text("avatar"),
  sharePercentage: integer("share_percentage").notNull().default(100),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  category: text("category", {
    enum: ["rent", "utilities", "groceries", "internet", "phone", "cleaning", "other"],
  })
    .notNull()
    .default("other"),
  paidBy: text("paid_by").notNull(),
  date: text("date").notNull(),
  splitEvenly: integer("split_evenly", { mode: "boolean" }).notNull().default(true),
  splitPercentages: text("split_percentages"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const rentPayments = sqliteTable("rent_payments", {
  id: text("id").primaryKey(),
  amount: real("amount").notNull(),
  month: text("month").notNull(), // YYYY-MM
  paidBy: text("paid_by").notNull(),
  date: text("date").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const chores = sqliteTable("chores", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  assignedTo: text("assigned_to").notNull(),
  frequency: text("frequency", {
    enum: ["daily", "weekly", "biweekly", "monthly"],
  })
    .notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),
  assignedAt: text("assigned_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
