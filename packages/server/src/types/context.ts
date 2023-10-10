import { Logger } from "pino";
import { TransactionRepository, UserRepository } from "../repositories";

export interface Context {
  logger: Logger;
  db: {
    user: UserRepository;
    transaction: TransactionRepository;
  };
}
