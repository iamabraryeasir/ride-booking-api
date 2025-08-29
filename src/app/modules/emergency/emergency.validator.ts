import z from 'zod';
import { CONTACT_RELATIONSHIP } from './emergency.interface';

export const createEmergencyContactZodValidator = z.object({
    name: z
        .string('Name must be string type')
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(50, { message: 'Name can be maximum 50 characters' }),
    phone: z
        .string('Phone number must be a string')
        .regex(/^\+8801[3-9]\d{8}$/, {
            message:
                'Phone number must start with +880 and be a valid Bangladeshi number (e.g. +88017XXXXXXXX)',
        }),
    relationship: z.enum(Object.values(CONTACT_RELATIONSHIP)),
    isPrimary: z.boolean().optional(),
});

export const updateEmergencyContactZodValidator = z.object({
    name: z
        .string('Name must be string type')
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(50, { message: 'Name can be maximum 50 characters' })
        .optional(),
    phone: z
        .string('Phone number must be a string')
        .regex(/^\+8801[3-9]\d{8}$/, {
            message:
                'Phone number must start with +880 and be a valid Bangladeshi number (e.g. +88017XXXXXXXX)',
        })
        .optional(),
    relationship: z.enum(Object.values(CONTACT_RELATIONSHIP)).optional(),
    isPrimary: z.boolean().optional(),
    isActive: z.boolean().optional(),
});
