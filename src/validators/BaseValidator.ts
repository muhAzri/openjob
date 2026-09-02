import type { ObjectSchema } from 'joi';
import { InvariantError } from '../errors';

export abstract class BaseValidator {
  protected static runValidation<T>(schema: ObjectSchema<T>, payload: unknown): T {
    const result = schema.validate(payload, { abortEarly: false });
    if (result.error) {
      const message = result.error.details.map((detail) => detail.message).join(', ');
      throw new InvariantError(message);
    }
    return result.value;
  }
}
