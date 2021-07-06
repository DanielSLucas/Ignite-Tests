import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import { createConnection } from "typeorm";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to get an statement operation data", async () => {
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

    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description: "Achei na rua"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const { id } = depositResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("type");
  });
});
