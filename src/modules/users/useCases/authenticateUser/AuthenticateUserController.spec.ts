import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import { createConnection } from "typeorm";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to authenticate a user and return an JWT token", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
