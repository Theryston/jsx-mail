import { Request, Response } from 'express';

export class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    return response.sendStatus(201);
  }

  async find(request: Request, response: Response): Promise<Response> {
    return response.json([
      {
        name: 'John',
        email: 'john@example.com',
      },
      {
        name: 'Theryston',
        email: 'Theryston@example.com',
      },
    ]);
  }
}
