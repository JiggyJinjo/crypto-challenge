import { TYPES } from "../types";
import { AsyncContainerModule, interfaces } from "inversify";
import { TransactionRepository, UserRepository } from "../repositories";
import { DB } from "../entities";
import { Kysely } from "kysely";

export const repositoriesModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<UserRepository>(TYPES.UserRepository)
      .toDynamicValue(async ({ container }) => {
        const db = await container.getAsync<Kysely<DB>>(TYPES.DB);

        return new UserRepository(db);
      })
      .inSingletonScope();

    bind<TransactionRepository>(TYPES.TransactionRepository)
      .toDynamicValue(async ({ container }) => {
        const db = await container.getAsync<Kysely<DB>>(TYPES.DB);

        return new TransactionRepository(db);
      })
      .inSingletonScope();
  },
);
