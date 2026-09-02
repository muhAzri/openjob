import type { Request, Response } from 'express';
import type { UserService } from '../services/UserService';
import type { RegisterUserPayload, UpdateUserPayload } from '../domain/dto/AuthDto';
import { requireUserId } from './RequestUser';
import { AuthorizationError } from '../errors';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public postUser = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.register(req.body as RegisterUserPayload);
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

  public putUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    if (id !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak memperbarui user ini');
    }

    const user = await this.userService.update(id, req.body as UpdateUserPayload);
    res.status(200).json({
      status: 'success',
      message: 'User berhasil diperbarui',
      data: user,
    });
  };
}
