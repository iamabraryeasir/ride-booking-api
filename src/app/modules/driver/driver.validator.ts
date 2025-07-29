import z from 'zod';

export const applyForDriverZodValidator = z.object({
    vehicleNumber: z
        .string('Vehicle number is required')
        .min(6, 'Vehicle number must be at least 6 characters'),

    vehicleModel: z
        .string('Vehicle model is required')
        .min(3, 'Vehicle model must be at least 3 characters'),

    licenseNumber: z
        .string('License number is required')
        .min(6, 'License number must be at least 6 characters'),
});

export const rejectedDriverApplicationZodValidator = z.object({
    rejectionReason: z.string().min(10),
});
