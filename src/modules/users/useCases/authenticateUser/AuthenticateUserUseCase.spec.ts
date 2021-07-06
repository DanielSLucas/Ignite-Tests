import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });
  it("Should be able to authenticate a user", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const authentication = await authenticateUserUseCase.execute({
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    expect(authentication).toHaveProperty("user");
    expect(authentication).toHaveProperty("token");
  });

  it("Should not be able to authenticate a user with an incorrect email", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    await expect(authenticateUserUseCase.execute({
      email: "incorrect@email.com",
      password: "john123doe",
    })).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate a user with an incorrect password", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    await expect(authenticateUserUseCase.execute({
      email: "johnDoe@email.com",
      password: "incorrectPassword",
    })).rejects.toBeInstanceOf(AppError);
  });
});
