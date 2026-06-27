declare module "better-sqlite3" {
  type DB = Record<string, unknown>;

  interface DatabaseInstance {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
    pragma(key: string): unknown;
  }

  interface Statement {
    all(...params: unknown[]): unknown[];
    get(...params: unknown[]): unknown | undefined;
    run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
  }

  const Database: {
    new(path: string): DatabaseInstance;
    DB: DB;
  };

  export default Database;
  export type { DatabaseInstance, Statement };
}
