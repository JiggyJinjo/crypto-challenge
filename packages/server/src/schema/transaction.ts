import { User } from "./user.ts";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  recipientId: User["id"];
  senderId: User["id"];
};
