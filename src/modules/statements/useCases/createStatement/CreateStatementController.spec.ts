import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import { createConnection } from "typeorm";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to create a deposit statement", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description: "Achei na rua"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("type");
  });


  it("Should be able to create a withdraw statement", async () => {
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

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description: "Achei na rua"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "Um lanchinho no shopping ;-;"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("type");
  });

  it("Should be able to create a transfer statement", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    const authenticationResponse1 = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "johnDoe@email.com",
        password: "john123doe",
      });

    const { user: user1 } = authenticationResponse1.body;

    await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe Second",
        email: "johnDoe2@email.com",
        password: "john123doe",
      });

    const authenticationResponse2 = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "johnDoe2@email.com",
        password: "john123doe",
      });

    const { token } = authenticationResponse2.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Achei na rua"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .post(`/api/v1/statements/transfers/${user1.id}`)
      .send({
        amount: 50,
        description: "Minha parte no lanchinho no shopping ;-;"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("sender_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("type");
  });
});
