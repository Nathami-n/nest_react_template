/**
 * Standard API response wrapper
 */
export interface BaseResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
    error?: string;
}

/**
 * Paginated API response wrapper
 */
export interface PaginatedResponse<T> extends BaseResponse<T[]> {
    meta: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
