import { Kysely } from "kysely";
import { AllSelection, DB } from "../entities";
import { User } from "../schema";

export class UserRepository {
  constructor(readonly db: Kysely<DB>) {}

  async all(limit = 50, offset = 0): Promise<User[]> {
    const results = await this.db
      .selectFrom("users")
      .limit(limit)
      .offset(offset)
      .selectAll("users")
      .execute();
    return this.toResults(results);
  }

  async find(id: string): Promise<User> {
    const result = await this.db
      .selectFrom("users")
      .where("users.id", "=", id)
      .selectAll("users")
      .executeTakeFirstOrThrow();
    return this.toResult(result);
  }

  async create(data: Omit<User, "id">): Promise<User> {
    const { name, balance } = data;
    const result = await this.db
      .insertInto("users")
      .values({
        name,
        balance,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.toResult(result);
  }

  async update(id: string, data: Omit<User, "balance">): Promise<User> {
    const { name } = data;

    const result = await this.db
      .updateTable("users")
      .set({
        name: name,
      })
      .where("users.id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.toResult(result);
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom("users").where("users.id", "=", id).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom("users").execute();
  }

  private toResult(user: AllSelection<DB, "users">): User {
    return { ...user, balance: parseFloat(user.balance) };
  }

  private toResults(users: Array<AllSelection<DB, "users">>): Array<User> {
    return users.map(this.toResult);
  }
}
