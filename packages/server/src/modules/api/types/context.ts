import { TransactionRepository, UserRepository } from "../../../repositories";

export interface Repositories {
  userRepository: UserRepository;
  transactionRepository: TransactionRepository;
}
