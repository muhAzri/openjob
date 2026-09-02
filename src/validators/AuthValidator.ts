import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { LoginPayload, RefreshTokenPayload } from '../domain/dto/AuthDto';

const loginSchema = Joi.object<LoginPayload>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object<RefreshTokenPayload>({
  refreshToken: Joi.string().required(),
});

export class AuthValidator extends BaseValidator {
  public static validateLoginPayload = (payload: unknown): LoginPayload => {
    return BaseValidator.runValidation(loginSchema, payload);
  };

  public static validateRefreshTokenPayload = (payload: unknown): RefreshTokenPayload => {
    return BaseValidator.runValidation(refreshTokenSchema, payload);
  };
}
