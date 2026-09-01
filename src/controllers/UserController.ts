import type { Request, Response } from 'express';
import type { UserService } from '../services/UserService';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public postUser = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.register(req.body);
    res.status(201).json({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: user,
    });
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const user = await this.userService.getById(id);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  };
}
