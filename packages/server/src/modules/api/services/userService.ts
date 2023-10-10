import { User } from "../../../schema";
import { UserRepository } from "../../../repositories";

export abstract class UserService {
  static async getUser(
    userRepository: UserRepository,
    id: User["id"],
  ): Promise<User> {
    try {
      return await userRepository.find(id);
    } catch (e) {
      throw new Error(`Could not fetch user ${id}`);
    }
  }

  static async getAllUsers(userRepository: UserRepository): Promise<User[]> {
    try {
      return userRepository.all();
    } catch (e) {
      throw new Error(`Could not fetch users`);
    }
  }

  static async createUser(
    userRepository: UserRepository,
    userInput: Omit<User, "id">,
  ): Promise<User> {
    try {
      const user = await userRepository.create(userInput);
      return user;
    } catch (e) {
      throw new Error(`Could not create user`);
    }
  }
}
