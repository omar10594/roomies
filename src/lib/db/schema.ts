import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const roomies = sqliteTable("roomies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  rentAmount: integer("rent_amount").notNull(),
  rentDay: integer("rent_day").notNull(),
  startDate: text("start_date"),
  graceDays: integer("grace_days").notNull().default(5),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  accessCode: text("access_code"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const depositAccounts = sqliteTable("deposit_accounts", {
  id: text("id").primaryKey(),
  clabe: text("clabe").notNull().unique(),
  label: text("label").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  roomieId: text("roomie_id")
    .notNull()
    .references(() => roomies.id),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  note: text("note"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Roomie = typeof roomies.$inferSelect;
export type NewRoomie = typeof roomies.$inferInsert;
export type DepositAccount = typeof depositAccounts.$inferSelect;
export type NewDepositAccount = typeof depositAccounts.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Setting = typeof settings.$inferSelect;
