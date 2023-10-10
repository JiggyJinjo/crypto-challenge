import type { ColumnType } from "kysely";
import { AnyColumn, DrainOuterGeneric } from "kysely/dist/cjs/util/type-utils";
import { SelectType } from "kysely/dist/cjs/util/column-type";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, string | number, string | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Transactions {
  id: Generated<string>;
  amount: Numeric;
  date: Generated<Timestamp>;
  recipient_id: string;
  sender_id: string;
}

export interface Users {
  id: Generated<string>;
  name: string;
  balance: Numeric;
}

export interface DB {
  transactions: Transactions;
  users: Users;
}

export type AllSelection<DB, TB extends keyof DB> = DrainOuterGeneric<{
  [C in AnyColumn<DB, TB>]: {
    [T in TB]: SelectType<C extends keyof DB[T] ? DB[T][C] : never>;
  }[TB];
}>;
