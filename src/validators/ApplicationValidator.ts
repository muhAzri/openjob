import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type {
  CreateApplicationPayload,
  UpdateApplicationPayload,
} from '../domain/dto/ApplicationDto';

const APPLICATION_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'] as const;

const createSchema = Joi.object<CreateApplicationPayload>({
  user_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  job_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  cover_letter: Joi.string().allow('').max(5000).optional(),
  status: Joi.string()
    .valid(...APPLICATION_STATUSES)
    .optional(),
});

const updateSchema = Joi.object<UpdateApplicationPayload>({
  status: Joi.string()
    .valid(...APPLICATION_STATUSES)
    .required(),
});

export class ApplicationValidator extends BaseValidator {
  public static validateCreatePayload = (payload: unknown): CreateApplicationPayload => {
    return BaseValidator.runValidation(createSchema, payload);
  };

  public static validateUpdatePayload = (payload: unknown): UpdateApplicationPayload => {
    return BaseValidator.runValidation(updateSchema, payload);
  };
}
