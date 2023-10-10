import { AsyncContainerModule, interfaces } from "inversify";
import Pool from "pg-pool";
import { Client } from "pg";
import { TYPES } from "../types";
import { Logger } from "pino";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "../entities";

export const databaseModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<Pool<Client>>(TYPES.PGPool)
      .toDynamicValue(async ({ container }) => {
        const logger = await container.getAsync<Logger>(TYPES.Logger);

        const pool = new Pool({
          database: Bun.env.POSTGRES_DB,
          user: Bun.env.POSTGRES_USER,
          password: Bun.env.POSTGRES_PASSWORD,
          host: Bun.env.POSTGRES_HOST,
          port: Number.parseInt(Bun.env.POSTGRES_PORT || "5432"),
          ssl: Bun.env.POSTGRES_SSL?.toLowerCase() === "true",
          max: Number.parseInt(Bun.env.POSTGRES_POOL_MAX || "20"), // set pool max size to 20
          idleTimeoutMillis: 1000, // close idle clients after 1 second
          connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
          maxUses: 7500, // close (and replace) a connection after it has been used 7500 times
        });

        pool.on("error", (e) => {
          logger.error("DB error", e);
        });

        return pool;
      })
      .inSingletonScope()
      .onDeactivation((p) => {
        p.end();
      });

    bind<Kysely<DB>>(TYPES.DB)
      .toDynamicValue(async ({ container }) => {
        const pool = await container.getAsync<Pool<Client>>(TYPES.PGPool);

        const db = new Kysely<DB>({
          dialect: new PostgresDialect({
            pool,
          }),
        });

        return db;
      })
      .inSingletonScope();
  },
);
