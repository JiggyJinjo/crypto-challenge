import { User } from "../../../schema";

export interface RequestWithUserId extends Request {
  params: {
    userId: User["id"];
  };
}
