import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any> | any) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);

    if (result.success) {
      return result.data;
    }

    const firstError = result.error.errors[0];
    const errorMessage = firstError ? firstError.message : 'Validation failed';

    throw new BadRequestException({
      message: errorMessage,
      errors: result.error.format(),
      statusCode: 400,
    });
  }
}
