import type { ObjectSchema } from 'joi';
import { InvariantError } from '../errors';

export abstract class BaseValidator {
  protected static runValidation<T>(schema: ObjectSchema<T>, payload: unknown): T {
    const { error, value } = schema.validate(payload, { abortEarly: false });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      throw new InvariantError(message);
    }
    return value;
  }
}
