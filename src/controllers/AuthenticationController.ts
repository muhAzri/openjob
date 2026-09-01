import type { Request, Response } from 'express';
import type { AuthenticationService } from '../services/AuthenticationService';
import type { RefreshTokenPayload } from '../domain/dto/AuthDto';

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  public postAuthentication = async (req: Request, res: Response): Promise<void> => {
    const { accessToken, refreshToken } = await this.authenticationService.login(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: { accessToken, refreshToken },
    });
  };

  public putAuthentication = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as RefreshTokenPayload;
    const accessToken = await this.authenticationService.refreshAccessToken(refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: { accessToken },
    });
  };

  public deleteAuthentication = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as RefreshTokenPayload;
    await this.authenticationService.logout(refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  };
}
