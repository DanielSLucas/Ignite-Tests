import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  });
  it("Should be able to show a statement", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const depositStatement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      amount: 50.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: createdUser.id as string,
      statement_id: depositStatement.id as string
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
    expect(statement).toHaveProperty("type");
  });

  it("Should not be able to show a statement for a nonexistent user", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const depositStatement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      amount: 50.00,
      description: "Achei na rua",
      type: "deposit" as OperationType,
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "nonexistent-user-id",
        statement_id: depositStatement.id as string
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to show a statement for a nonexistent statement", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: createdUser.id as string,
        statement_id: "nonexistent-statement-id"
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
