import { AsyncContainerModule, interfaces } from "inversify";
import express, { Express } from "express";
import http from "http";
import { TYPES } from "../types";
import path from "path";

export const serverModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<Express>(TYPES.Express)
      .toDynamicValue(async ({ container }) => {
        const app = express();
        app.disable("x-powered-by");

        app.use("/", express.static(path.join(__dirname, "../public")));

        return app;
      })
      .inSingletonScope();

    bind<http.Server>(TYPES.HTTPServer)
      .toDynamicValue(async ({ container }) => {
        const app = await container.getAsync<Express>(TYPES.Express);

        return http.createServer(app);
      })
      .inSingletonScope();
  },
);
