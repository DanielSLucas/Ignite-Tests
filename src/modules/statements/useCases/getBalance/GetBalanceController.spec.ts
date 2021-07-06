import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import { createConnection } from "typeorm";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to show the logged user's balance", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    const authenticationResponse = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    const { token } = authenticationResponse.body;

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });
});
