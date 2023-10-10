import { RequestHandler } from "express";
import { UserService } from "../services/userService.ts";
import { Repositories } from "../types/context.ts";

export const getUser =
  ({ userRepository }: Repositories) =>
  (): RequestHandler =>
  async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await UserService.getUser(userRepository, userId);

      res.send(user);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };

export const getAllUser =
  ({ userRepository }: Repositories) =>
  (): RequestHandler =>
  async (req, res) => {
    try {
      const users = await UserService.getAllUsers(userRepository);

      res.send(users);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };

export const createUser =
  ({ userRepository }: Repositories) =>
  (): RequestHandler =>
  async (req, res) => {
    const user = await UserService.createUser(userRepository, req.body);
    res.send(user);
  };
