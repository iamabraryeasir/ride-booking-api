import z from 'zod';

const notificationSettingsSchema = z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
    rideUpdates: z.boolean().optional(),
    promotions: z.boolean().optional(),
    emergencyAlerts: z.boolean().optional(),
});

const privacySettingsSchema = z.object({
    shareLocation: z.boolean().optional(),
    sharePhoneNumber: z.boolean().optional(),
    shareRideHistory: z.boolean().optional(),
});

export const updateSettingsZodValidator = z.object({
    notifications: notificationSettingsSchema.optional(),
    privacy: privacySettingsSchema.optional(),
    language: z.enum(['en', 'bn']).optional(),
    currency: z.enum(['BDT', 'USD']).optional(),
    timezone: z.string().optional(),
});
