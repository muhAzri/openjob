import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { CreateCompanyPayload, UpdateCompanyPayload } from '../domain/dto/CompanyDto';

const createSchema = Joi.object<CreateCompanyPayload>({
  name: Joi.string().min(2).max(150).required(),
  location: Joi.string().min(1).max(150).required(),
  description: Joi.string().allow('').max(2000).optional(),
});

const updateSchema = Joi.object<UpdateCompanyPayload>({
  name: Joi.string().min(2).max(150).optional(),
  location: Joi.string().min(1).max(150).optional(),
  description: Joi.string().allow('').max(2000).optional(),
});

export class CompanyValidator extends BaseValidator {
  public static validateCreatePayload(payload: unknown): CreateCompanyPayload {
    return BaseValidator.runValidation(createSchema, payload);
  }

  public static validateUpdatePayload(payload: unknown): UpdateCompanyPayload {
    return BaseValidator.runValidation(updateSchema, payload);
  }
}
