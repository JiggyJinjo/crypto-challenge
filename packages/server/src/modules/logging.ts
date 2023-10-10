import pino, { Logger } from "pino";
import { TYPES } from "../types";
import { AsyncContainerModule, interfaces } from "inversify";
import data from "../../package.json";

export const loggingModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<Logger>(TYPES.Logger)
      .toDynamicValue(async () => {
        const logger = pino({
          level: Bun.env.LOG_LEVEL || "error",
          enabled: Bun.env.LOG_ENABLED?.toLowerCase() === "true",
          formatters: {
            log: (obj) => {
              obj.version = data.version;
              obj.app = data.name;
              return obj;
            },
          },
        });

        return logger;
      })
      .inSingletonScope()
      .onDeactivation((l) => {
        l.flush();
      });
  },
);
