import { PaginationMeta } from "../pagination";

export interface BuildPaginationMetaParams {
    page: number;
    limit: number;
    total: number;
}

export function buildPaginationMeta(params: BuildPaginationMetaParams): PaginationMeta {
    const { page, limit, total } = params;
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}