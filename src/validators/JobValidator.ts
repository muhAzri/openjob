import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { CreateJobPayload, JobQueryParams, UpdateJobPayload } from '../domain/dto/JobDto';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship'] as const;

const createSchema = Joi.object<CreateJobPayload>({
  title: Joi.string().min(2).max(150).required(),
  description: Joi.string().allow('').max(5000).optional(),
  companyId: Joi.string().guid({ version: 'uuidv4' }).required(),
  categoryId: Joi.string().guid({ version: 'uuidv4' }).required(),
  location: Joi.string().allow('').max(150).optional(),
  employmentType: Joi.string().valid(...EMPLOYMENT_TYPES).optional(),
  salaryMin: Joi.number().integer().min(0).optional(),
  salaryMax: Joi.number().integer().min(Joi.ref('salaryMin')).optional(),
});

const updateSchema = Joi.object<UpdateJobPayload>({
  title: Joi.string().min(2).max(150).optional(),
  description: Joi.string().allow('').max(5000).optional(),
  companyId: Joi.string().guid({ version: 'uuidv4' }).optional(),
  categoryId: Joi.string().guid({ version: 'uuidv4' }).optional(),
  location: Joi.string().allow('').max(150).optional(),
  employmentType: Joi.string().valid(...EMPLOYMENT_TYPES).optional(),
  salaryMin: Joi.number().integer().min(0).optional(),
  salaryMax: Joi.number().integer().min(0).optional(),
});

const querySchema = Joi.object({
  title: Joi.string().max(150).optional(),
  'company-name': Joi.string().max(150).optional(),
}).unknown(true);

export class JobValidator extends BaseValidator {
  public static validateCreatePayload(payload: unknown): CreateJobPayload {
    return BaseValidator.runValidation(createSchema, payload);
  }

  public static validateUpdatePayload(payload: unknown): UpdateJobPayload {
    return BaseValidator.runValidation(updateSchema, payload);
  }

  public static validateQueryParams(query: unknown): JobQueryParams {
    const validated = BaseValidator.runValidation(querySchema, query) as Record<string, string | undefined>;
    const result: JobQueryParams = {};
    if (validated['title'] !== undefined) {
      Object.assign(result, { title: validated['title'] });
    }
    if (validated['company-name'] !== undefined) {
      Object.assign(result, { companyName: validated['company-name'] });
    }
    return result;
  }
}
