import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: logged_user_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    let type = splittedPath[splittedPath.length - 1] as OperationType;
    let statement;

    const createStatement = container.resolve(CreateStatementUseCase);

    if (user_id) {
      statement = await createStatement.execute({
        user_id: user_id,
        sender_id: logged_user_id,
        type: 'transfer' as OperationType,
        amount,
        description
      });

      return response.status(201).json(statement);
    }

    statement = await createStatement.execute({
      user_id: logged_user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
