import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../domain/dto/CategoryDto';

const createSchema = Joi.object<CreateCategoryPayload>({
  name: Joi.string().min(2).max(100).required(),
});

const updateSchema = Joi.object<UpdateCategoryPayload>({
  name: Joi.string().min(2).max(100).optional(),
});

export class CategoryValidator extends BaseValidator {
  public static validateCreatePayload = (payload: unknown): CreateCategoryPayload => {
    return BaseValidator.runValidation(createSchema, payload);
  };

  public static validateUpdatePayload = (payload: unknown): UpdateCategoryPayload => {
    return BaseValidator.runValidation(updateSchema, payload);
  };
}
