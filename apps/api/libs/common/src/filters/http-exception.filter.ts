import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
    success: boolean;
    data: null;
    message: string;
    error: any;
    timestamp: string;
}

/**
 * Global exception filter that formats all errors to match the standard API response format
 * @example
 * ```typescript
 * // Standard error response
 * {
 *   success: false,
 *   data: null,
 *   message: "Error message",
 *   error: { statusCode: 400, details: [...] },
 *   timestamp: "2026-01-26T12:00:00.000Z"
 * }
 * ```
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || exception.message;
                error = {
                    statusCode: status,
                    ...(responseObj.error && { type: responseObj.error }),
                    ...(responseObj.errors && { details: responseObj.errors }),
                };
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = {
                statusCode: status,
                type: exception.name,
            };
        }

        const errorResponse: ErrorResponse = {
            success: false,
            data: null,
            message,
            error: error || {
                statusCode: status,
                path: request.url,
                method: request.method,
            },
            timestamp: new Date().toISOString(),
        };

        response.status(status).json(errorResponse);
    }
}
