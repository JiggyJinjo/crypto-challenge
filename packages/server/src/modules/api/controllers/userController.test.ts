import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, spyOn, test } from "bun:test";
import { Container } from "inversify";
import { Express } from "express";
import request from "supertest";
import userCases from "../../../../test/userCases.json";
import { UserRepository } from "../../../repositories";
import { asyncModules } from "../../index.ts";
import { TYPES } from "../../../types";
import { Routes } from "../routes.ts";

describe("users controller", () => {
  let container: Container;
  let app: Express;
  let userRepository: UserRepository;

  beforeAll(async () => {
    Bun.env.LOG_ENABLED = "false";
    container = new Container();
    await container.loadAsync(...asyncModules);
    app = await container.getAsync<Express>(TYPES.ExpressAPI);
    userRepository = await container.getAsync<UserRepository>(
      TYPES.UserRepository,
    );
  });

  afterAll(async () => {
    await userRepository.deleteAll();
    await container.unbindAllAsync();
  });

  test.each(userCases)("create users", async (user) => {
    const { body } = await request(app)
      .post(Routes.USERS)
      .set("Content-Type", "application/json")
      .send(user)
      .expect(200);

    expect(body.id).toBeString();
    expect(body.name).toBe(user.name);
    expect(body.balance).toBe(user.balance);
  });

  test("fetch specific user", async () => {
    const mockUserId = "1";

    const mockUser = {
      id: mockUserId,
      name: "test",
      balance: 123,
    };
    const spy = spyOn(userRepository, "find").mockResolvedValue(mockUser);

    const { body } = await request(app)
      .get(`${Routes.USERS}/${mockUserId}`)
      .set("Content-Type", "application/json")
      .expect(200);

    expect(spy).toHaveBeenCalled();
    expect(body).toEqual(mockUser);

    spy.mockClear();
  });

  //TODO: Check 404 is sent when no user found
});
