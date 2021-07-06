import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
describe("Get Balance Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });
  it("Should be able to get user's balance", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: createdUser.id as string
    });

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  });

  it("Should not be able to show the profile of an nonexistent user", async () => {
    await expect(
      getBalanceUseCase.execute({user_id: "nonexistent-user-id"})
    ).rejects.toBeInstanceOf(AppError);
  });
});
