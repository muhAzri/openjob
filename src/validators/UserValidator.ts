import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { RegisterUserPayload } from '../domain/dto/AuthDto';

const registerSchema = Joi.object<RegisterUserPayload>({
  fullname: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(100).required(),
});

export class UserValidator extends BaseValidator {
  public static validateRegisterPayload(payload: unknown): RegisterUserPayload {
    return BaseValidator.runValidation(registerSchema, payload);
  }
}
