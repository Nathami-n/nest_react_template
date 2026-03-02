import { z } from 'zod';

export const exampleSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
});


export type ExampleInput = z.infer<typeof exampleSchema>;