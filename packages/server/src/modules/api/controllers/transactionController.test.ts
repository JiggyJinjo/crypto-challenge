import "reflect-metadata";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";
import { Container } from "inversify";
import { Express } from "express";
import request from "supertest";
import { TransactionRepository, UserRepository } from "../../../repositories";
import { asyncModules } from "../../index.ts";
import { TYPES } from "../../../types";
import { Routes } from "../routes.ts";
import { Transaction } from "../../../schema/transaction.ts";
import { UserService } from "../services/userService.ts";

describe("transaction controller", () => {
  let container: Container;
  let app: Express;
  let userRepository: UserRepository;
  let transactionRepository: TransactionRepository;

  beforeAll(async () => {
    Bun.env.LOG_ENABLED = "false";
    container = new Container();
    await container.loadAsync(...asyncModules);
    app = await container.getAsync<Express>(TYPES.ExpressAPI);
    userRepository = await container.getAsync<UserRepository>(
      TYPES.UserRepository,
    );
    transactionRepository = await container.getAsync<TransactionRepository>(
      TYPES.TransactionRepository,
    );
  });

  afterEach(async () => {
    await userRepository.deleteAll();
    await transactionRepository.deleteAll();
  });

  afterAll(async () => {
    await container.unbindAllAsync();
  });

  test("fetch transactions", async () => {
    const mockTransactions: Transaction[] = [
      {
        amount: 10,
        recipientId: "1",
        senderId: "2",
        id: "9",
        date: "date",
      },
      {
        amount: 20,
        recipientId: "1",
        senderId: "2",
        id: "9",
        date: "date",
      },
    ];

    const spy = spyOn(transactionRepository, "all").mockResolvedValue(
      mockTransactions,
    );

    const { body } = await request(app)
      .get(`${Routes.TRANSACTIONS}`)
      .set("Content-Type", "application/json")
      .expect(200);

    expect(spy).toHaveBeenCalled();
    expect(body).toEqual(mockTransactions);

    spy.mockClear();
  });

  test("transfer successful", async () => {
    const userA = await UserService.createUser(userRepository, {
      balance: 1000,
      name: "a",
    });
    const userB = await UserService.createUser(userRepository, {
      balance: 500,
      name: "b",
    });
    const transaction: Omit<Transaction, "id" | "date"> = {
      senderId: userA.id,
      recipientId: userB.id,
      amount: userA.balance,
    };

    await request(app)
      .post(`${Routes.TRANSACTIONS}`)
      .set("Content-Type", "application/json")
      .send(transaction)
      .expect(200);

    const updatedUserA = await UserService.getUser(userRepository, userA.id);
    const updatedUserB = await UserService.getUser(userRepository, userB.id);

    expect(updatedUserA.balance).toEqual(userA.balance - transaction.amount);
    expect(updatedUserB.balance).toEqual(userB.balance + transaction.amount);
  });

  test("When senderBalance is too low it should fail", async () => {
    const userA = await UserService.createUser(userRepository, {
      balance: 10,
      name: "a",
    });
    const userB = await UserService.createUser(userRepository, {
      balance: 500,
      name: "b",
    });
    const transaction: Omit<Transaction, "id" | "date"> = {
      senderId: userA.id,
      recipientId: userB.id,
      amount: userA.balance + 1,
    };

    await request(app)
      .post(`${Routes.TRANSACTIONS}`)
      .set("Content-Type", "application/json")
      .send(transaction)
      .expect(400);

    const updatedUserA = await UserService.getUser(userRepository, userA.id);
    const updatedUserB = await UserService.getUser(userRepository, userB.id);

    // It shouldn't change anyone's balance
    expect(updatedUserA.balance).toEqual(userA.balance);
    expect(updatedUserB.balance).toEqual(userB.balance);
  });

  test("When senderId does not exist it should fail", async () => {
    const userA = await UserService.createUser(userRepository, {
      balance: 10,
      name: "a",
    });
    const userB = await UserService.createUser(userRepository, {
      balance: 500,
      name: "b",
    });
    const transaction: Omit<Transaction, "id" | "date"> = {
      senderId: "randomId",
      recipientId: userB.id,
      amount: userA.balance + 1,
    };

    await request(app)
      .post(`${Routes.TRANSACTIONS}`)
      .set("Content-Type", "application/json")
      .send(transaction)
      .expect(400);

    const updatedUserA = await UserService.getUser(userRepository, userA.id);
    const updatedUserB = await UserService.getUser(userRepository, userB.id);

    // It shouldn't change anyone's balance
    expect(updatedUserA.balance).toEqual(userA.balance);
    expect(updatedUserB.balance).toEqual(userB.balance);
  });

  test("When receiverId does not exist it should fail", async () => {
    const userA = await UserService.createUser(userRepository, {
      balance: 10,
      name: "a",
    });
    const userB = await UserService.createUser(userRepository, {
      balance: 500,
      name: "b",
    });
    const transaction: Omit<Transaction, "id" | "date"> = {
      senderId: userA.id,
      recipientId: "randomId",
      amount: userA.balance + 1,
    };

    await request(app)
      .post(`${Routes.TRANSACTIONS}`)
      .set("Content-Type", "application/json")
      .send(transaction)
      .expect(400);

    const updatedUserA = await UserService.getUser(userRepository, userA.id);
    const updatedUserB = await UserService.getUser(userRepository, userB.id);

    // It shouldn't change anyone's balance
    expect(updatedUserA.balance).toEqual(userA.balance);
    expect(updatedUserB.balance).toEqual(userB.balance);
  });
});
