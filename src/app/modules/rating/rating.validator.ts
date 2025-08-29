import z from 'zod';

export const createRatingZodValidator = z.object({
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().max(500, 'Comment must be at most 500 characters').optional(),
});

export const updateRatingZodValidator = z.object({
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
    comment: z.string().max(500, 'Comment must be at most 500 characters').optional(),
});
