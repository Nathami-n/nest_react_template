
export const EXAMPLE_ENUM = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    SUSPENDED: "SUSPENDED",
    REJECTED: "REJECTED",
} as const;

export type ExampleResourceStatus = typeof EXAMPLE_ENUM[keyof typeof EXAMPLE_ENUM];