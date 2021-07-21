import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
describe("Create Statement Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });
  it("Should be able to create a deposit statement", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      amount: 50.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
    expect(statement).toHaveProperty("type");
  });

  it("Should be able to create a withdraw statement", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      amount: 100.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      amount: 50.00,
      description: "Lanchinho no shopping",
      type: "deposit" as OperationType,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
    expect(statement).toHaveProperty("type");
  });

  it("Should not be able to create a withdraw statement with invalid balance", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      amount: 50.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    await expect(
      createStatementUseCase.execute({
        user_id: createdUser.id as string,
        amount: 100.00,
        description: "Lanchinho no shopping",
        type: "withdraw" as OperationType,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to create a transfer statement", async () => {
    const user1 = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const user2 = await createUserUseCase.execute({
      name: "John Doe Second",
      email: "johnDoe2@email.com",
      password: "john123doe",
    });

    await createStatementUseCase.execute({
      user_id: user1.id as string,
      amount: 100.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    const statement = await createStatementUseCase.execute({
      user_id: user2.id as string,
      sender_id: user1.id as string,
      amount: 50.00,
      description: "Minha parte no lanchinho no shopping",
      type: "transfer" as OperationType,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
    expect(statement).toHaveProperty("type");
  });

  it("Should not be able to create a transfer statement to an nonexistent user", async () => {
    const user1 = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    await createStatementUseCase.execute({
      user_id: user1.id as string,
      amount: 100.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    await expect(
      createStatementUseCase.execute({
      user_id: "nonexistent-user-id",
      sender_id: user1.id as string,
      amount: 50.00,
      description: "Minha parte no lanchinho no shopping",
      type: "transfer" as OperationType,
    })).rejects.toBeInstanceOf(AppError)
  });

  it("Should not be able to create a transfer statement with invalid balance", async () => {
    const user1 = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const user2 = await createUserUseCase.execute({
      name: "John Doe Second",
      email: "johnDoe2@email.com",
      password: "john123doe",
    });

    await createStatementUseCase.execute({
      user_id: user1.id as string,
      amount: 50.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    await expect(
      createStatementUseCase.execute({
      user_id: user2.id as string,
      sender_id: user1.id as string,
      amount: 100.00,
      description: "Minha parte no lanchinho no shopping",
      type: "transfer" as OperationType,
    })).rejects.toBeInstanceOf(AppError)
  });

  it("Should not be able to create a statement for a nonexistent user", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "nonexistent-user-id",
        amount: 50.00,
        description: "Achei na rua",
        type: "deposit" as OperationType,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
