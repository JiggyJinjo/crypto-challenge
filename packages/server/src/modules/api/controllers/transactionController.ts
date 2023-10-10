import { RequestHandler } from "express";
import { Repositories } from "../types/context.ts";
import { User } from "../../../schema";
import { Transaction } from "../../../schema/transaction.ts";

export const getTransactions =
  ({ transactionRepository }: Repositories) =>
  (): RequestHandler =>
  async (_, res, next) => {
    try {
      const transactions = await transactionRepository.all();
      res.send(transactions);
    } catch (e: any) {
      res.status(400);
      res.send(e.message);
    }

    res.send();
  };

export const transfer =
  ({ userRepository, transactionRepository }: Repositories) =>
  (): RequestHandler =>
  async (req, res, next) => {
    const { senderId, recipientId, amount } = req.body;

    try {
      const sender = await userRepository.find(senderId);
      const receiver = await userRepository.find(recipientId);

      checkTransferPossible(sender, receiver, amount);

      await transactionRepository.transfer({ senderId, recipientId, amount });
    } catch (e: any) {
      res.status(400);
      res.send(e.message);
    }

    res.send();
  };

const checkTransferPossible = (
  sender: User,
  receiver: User,
  amount: Transaction["amount"],
) => {
  if (!sender) throw new Error("Sender could not be found");
  if (!receiver) throw new Error("Receiver could not be found");

  if (amount > sender.balance)
    throw new Error("Sender balance is not sufficient for transaction");
};
