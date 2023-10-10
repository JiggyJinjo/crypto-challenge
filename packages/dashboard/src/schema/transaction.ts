import { User } from "./user";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  recipientId: User["id"];
  senderId: User["id"];
};
