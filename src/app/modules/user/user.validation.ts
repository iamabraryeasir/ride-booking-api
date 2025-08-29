import z from 'zod';

export const registerUserZodSchema = z.object({
    name: z
        .string('Name must be string type')
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(50, { message: 'Name can be maximum 50 characters' }),
    email: z
        .string('Email must be string type')
        .email({ message: 'Email must be in proper email format' }),
    password: z
        .string('Phone number must be string type')
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/(?=.*[A-Z])/, {
            message: 'Password must contain at least one uppercase letter',
        })
        .regex(/(?=.*[a-z])/, {
            message: 'Password must contain at least one lowercase letter',
        })
        .regex(/(?=.*\d)/, {
            message: 'Password must contain at least one number',
        })
        // eslint-disable-next-line no-useless-escape
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\];'`~])/, {
            message: 'Password must contain at least one special character',
        }),
    phone: z
        .string('Phone number must be a string')
        .regex(/^\+8801[3-9]\d{8}$/, {
            message:
                'Phone number must start with +880 and be a valid Bangladeshi number (e.g. +88017XXXXXXXX)',
        })
        .optional(),
});

export const updateProfileZodSchema = z.object({
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
    picture: z.string().url('Picture must be a valid URL').optional(),
});

export const changePasswordZodSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string('Password must be string type')
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/(?=.*[A-Z])/, {
            message: 'Password must contain at least one uppercase letter',
        })
        .regex(/(?=.*[a-z])/, {
            message: 'Password must contain at least one lowercase letter',
        })
        .regex(/(?=.*\d)/, {
            message: 'Password must contain at least one number',
        })
        // eslint-disable-next-line no-useless-escape
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\];'`~])/, {
            message: 'Password must contain at least one special character',
        }),
});
