import Joi from 'joi';
import { BaseValidator } from './BaseValidator';
import type { CreateJobPayload, JobQueryParams, UpdateJobPayload } from '../domain/dto/JobDto';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'] as const;
const JOB_STATUSES = ['open', 'close'] as const;

const createSchema = Joi.object<CreateJobPayload>({
  title: Joi.string().min(2).max(150).required(),
  description: Joi.string().allow('').max(5000).optional(),
  company_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  category_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  job_type: Joi.string()
    .valid(...JOB_TYPES)
    .optional(),
  experience_level: Joi.string().allow('').max(30).optional(),
  location_type: Joi.string().allow('').max(30).optional(),
  location_city: Joi.string().allow('').max(150).optional(),
  salary_min: Joi.number().integer().min(0).optional(),
  salary_max: Joi.number().integer().min(Joi.ref('salary_min')).optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string()
    .valid(...JOB_STATUSES)
    .optional(),
});

const updateSchema = Joi.object<UpdateJobPayload>({
  title: Joi.string().min(2).max(150).optional(),
  description: Joi.string().allow('').max(5000).optional(),
  company_id: Joi.string().guid({ version: 'uuidv4' }).optional(),
  category_id: Joi.string().guid({ version: 'uuidv4' }).optional(),
  job_type: Joi.string()
    .valid(...JOB_TYPES)
    .optional(),
  experience_level: Joi.string().allow('').max(30).optional(),
  location_type: Joi.string().allow('').max(30).optional(),
  location_city: Joi.string().allow('').max(150).optional(),
  salary_min: Joi.number().integer().min(0).optional(),
  salary_max: Joi.number().integer().min(0).optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string()
    .valid(...JOB_STATUSES)
    .optional(),
});

const querySchema = Joi.object({
  title: Joi.string().allow('').max(150).optional(),
  'company-name': Joi.string().allow('').max(150).optional(),
}).unknown(true);

export class JobValidator extends BaseValidator {
  public static validateCreatePayload = (payload: unknown): CreateJobPayload => {
    return BaseValidator.runValidation(createSchema, payload);
  };

  public static validateUpdatePayload = (payload: unknown): UpdateJobPayload => {
    return BaseValidator.runValidation(updateSchema, payload);
  };

  public static validateQueryParams = (query: unknown): JobQueryParams => {
    const validated = BaseValidator.runValidation(querySchema, query) as Record<
      string,
      string | undefined
    >;
    const result: JobQueryParams = {};
    if (validated['title'] !== undefined) {
      Object.assign(result, { title: validated['title'] });
    }
    if (validated['company-name'] !== undefined) {
      Object.assign(result, { companyName: validated['company-name'] });
    }
    return result;
  };
}
