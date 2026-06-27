declare module "better-sqlite3" {
  interface Database {
    DB: Record<string, unknown>;
  }
}
