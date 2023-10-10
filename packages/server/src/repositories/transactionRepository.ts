import { Kysely, sql } from "kysely";
import { AllSelection, DB } from "../entities";
import { Transaction } from "../schema/transaction.ts";

export class TransactionRepository {
  constructor(readonly db: Kysely<DB>) {}

  async find(id: string): Promise<Transaction> {
    const result = await this.db
      .selectFrom("transactions")
      .where("transactions.id", "=", id)
      .selectAll("transactions")
      .executeTakeFirstOrThrow();

    return this.toTransaction(result);
  }

  async all(limit = 50, offset = 0): Promise<Transaction[]> {
    const results = await this.db
      .selectFrom("transactions")
      .limit(limit)
      .offset(offset)
      .selectAll("transactions")
      .execute();
    return this.toTransactions(results);
  }

  async create(data: Omit<Transaction, "id">): Promise<Transaction> {
    const { date, recipientId, senderId, amount } = data;
    const result = await this.db
      .insertInto("transactions")
      .values({
        amount,
        date,
        recipient_id: recipientId,
        sender_id: senderId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.toTransaction(result);
  }

  async transfer(transaction: Omit<Transaction, "date" | "id">): Promise<void> {
    const { senderId, amount, recipientId } = transaction;

    await sql<string>`SELECT transfer_funds(${senderId}, ${recipientId}, ${amount})`.execute(
      this.db,
    );
  }

  async delete(id: Transaction["id"]): Promise<void> {
    await this.db
      .deleteFrom("transactions")
      .where("transactions.id", "=", id)
      .execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom("transactions").execute();
  }

  private toTransaction(
    transaction: AllSelection<DB, "transactions">,
  ): Transaction {
    return {
      id: transaction.id,
      date: transaction.date,
      amount: parseFloat(transaction.amount),
      recipientId: transaction.recipient_id,
      senderId: transaction.sender_id,
    };
  }

  private toTransactions(
    transactions: Array<AllSelection<DB, "transactions">>,
  ): Array<Transaction> {
    return transactions.map(this.toTransaction);
  }
}
