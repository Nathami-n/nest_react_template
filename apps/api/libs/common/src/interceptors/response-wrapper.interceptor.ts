import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: any;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: Record<string, unknown>;
    message?: string;
    error?: any;
    timestamp: string;
}

/**
 * Metadata key for raw response decorator
 */
export const RAW_RESPONSE_KEY = 'rawResponse';

/**
 * Decorator to skip response wrapping for specific endpoints
 * @example
 * ```typescript
 * @Get('health')
 * @RawResponse()
 * healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);

/**
 * Helper function to check if response is a paginated response
 */
function isPaginatedResponse(data: unknown): boolean {
    return (
        data !== null &&
        typeof data === 'object' &&
        'data' in data &&
        'meta' in data &&
        Array.isArray((data as Record<string, unknown>).data)
    );
}

/**
 * Helper function to wrap response data
 */
function wrapResponse<T>(responseData: T): Response<T> | PaginatedResponse<T> {
    // Check if this is a paginated response (has data array and meta)
    if (isPaginatedResponse(responseData)) {
        const paginatedData = responseData as {
            data: T[];
            meta: Record<string, unknown>;
        };
        return {
            success: true,
            data: paginatedData.data,
            meta: paginatedData.meta,
            timestamp: new Date().toISOString(),
        };
    }

    // Default wrapping for non-paginated responses
    return {
        success: true,
        data: responseData,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Response wrapper interceptor with support for @RawResponse() decorator
 * Use this when you need to skip wrapping for specific endpoints
 *
 * @example
 * ```typescript
 * // In your module
 * providers: [
 *   {
 *     provide: APP_INTERCEPTOR,
 *     useClass: ResponseWrapperInterceptor,
 *   },
 * ]
 *
 * // In your controller
 * @Get('health')
 * @RawResponse()
 * healthCheck() {
 *   return { status: 'ok' }; // Won't be wrapped
 * }
 * ```
 */
@Injectable()
export class ResponseWrapperInterceptor<T>
    implements NestInterceptor<T, Response<T> | PaginatedResponse<T> | T> {
    constructor(private reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T> | PaginatedResponse<T> | T> {
        const isRawResponse = this.reflector.getAllAndOverride<boolean>(
            RAW_RESPONSE_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If @RawResponse() is applied, skip wrapping
        if (isRawResponse) {
            return next.handle();
        }

        // Otherwise, wrap the response
        return next
            .handle()
            .pipe(map((responseData) => wrapResponse(responseData)));
    }
}
