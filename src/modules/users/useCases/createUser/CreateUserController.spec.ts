import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import { createConnection } from "typeorm";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    expect(response.status).toBe(201);
  });
});
