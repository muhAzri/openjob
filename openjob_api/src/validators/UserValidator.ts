import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { RegisterUserPayload, UpdateUserPayload } from '../domain/dto/AuthDto';

const registerSchema = Joi.object<RegisterUserPayload>({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('user').optional(),
});

const updateSchema = Joi.object<UpdateUserPayload>({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().max(100).optional(),
}).min(1);

export class UserValidator extends BaseValidator {
  public static validateRegisterPayload = (payload: unknown): RegisterUserPayload => {
    return BaseValidator.runValidation(registerSchema, payload);
  };

  public static validateUpdatePayload = (payload: unknown): UpdateUserPayload => {
    return BaseValidator.runValidation(updateSchema, payload);
  };
}
