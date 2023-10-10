import { AsyncContainerModule } from "inversify";
import { serverModule } from "./server";
import { databaseModule } from "./database";
import { repositoriesModule } from "./repositories";
import { loggingModule } from "./logging.ts";
import { apiModule } from "./api/module.ts";

export const asyncModules: AsyncContainerModule[] = [
  databaseModule,
  repositoriesModule,
  apiModule,
  serverModule,
  loggingModule,
];
