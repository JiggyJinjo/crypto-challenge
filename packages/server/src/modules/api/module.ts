import { AsyncContainerModule, interfaces } from "inversify";
import express, { Express, NextFunction, Request, Response } from "express";
import http from "http";
import { TYPES } from "../../types";
import { TransactionRepository, UserRepository } from "../../repositories";
import { Routes } from "./routes.ts";
import {
  createUser,
  getAllUser,
  getUser,
} from "./controllers/userController.ts";
import bodyParser from "body-parser";
import {
  validateCreateUserInput,
  validateGetUserInput,
} from "./validation/user.validation.ts";
import {
  getTransactions,
  transfer,
} from "./controllers/transactionController.ts";
import { validateTransferInput } from "./validation/transaction.validation.ts";

import cors from "cors";

export const apiModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<Express>(TYPES.ExpressAPI)
      .toDynamicValue(async ({ container }) => {
        const app = express();
        app.use(bodyParser.json({ limit: "500mb" }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(
          (error: Error, req: Request, res: Response, _next: NextFunction) => {
            console.error("Unhandled error", error, req);
            res.status(500);
            res.send();
          },
        );

        app.use(cors());

        //TODO: use DI
        const userRepository = await container.getAsync<UserRepository>(
          TYPES.UserRepository,
        );

        //TODO: use DI
        const transactionRepository =
          await container.getAsync<TransactionRepository>(
            TYPES.TransactionRepository,
          );

        const repositories = { userRepository, transactionRepository };

        app.get(
          `${Routes.USERS}/:userId`,
          validateGetUserInput,
          getUser(repositories)(),
        );

        app.get(`${Routes.USERS}`, getAllUser(repositories)());

        app.post(
          Routes.USERS,
          validateCreateUserInput,
          createUser(repositories)(),
        );

        app.post(
          Routes.TRANSACTIONS,
          validateTransferInput,
          transfer(repositories)(),
        );

        app.get(Routes.TRANSACTIONS, getTransactions(repositories)());

        return app;
      })
      .inSingletonScope();

    bind<http.Server>(TYPES.APIServer)
      .toDynamicValue(async ({ container }) => {
        const app = await container.getAsync<Express>(TYPES.ExpressAPI);

        return http.createServer(app);
      })
      .inSingletonScope();
  },
);
