import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });
  it("Should be able to show user's profile", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johnDoe@email.com",
      password: "john123doe",
    });

    const user = await showUserProfileUseCase.execute(createdUser.id as string);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
  });

  it("Should not be able to show the profile of an nonexistent user", async () => {
    await expect(
      showUserProfileUseCase.execute("nonexistent-user-id")
    ).rejects.toBeInstanceOf(AppError);
  });
});
