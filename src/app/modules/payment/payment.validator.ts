import z from 'zod';
import { PAYMENT_METHOD_TYPE } from './payment.interface';

export const createPaymentMethodZodValidator = z.object({
    type: z.enum(Object.values(PAYMENT_METHOD_TYPE)),
    cardNumber: z.string().optional(),
    cardHolderName: z.string().optional(),
    expiryMonth: z.number().min(1).max(12).optional(),
    expiryYear: z.number().min(new Date().getFullYear()).optional(),
    mobileNumber: z.string().regex(/^\+8801[3-9]\d{8}$/).optional(),
    bankName: z.string().optional(),
    isDefault: z.boolean().optional(),
}).refine(
    (data) => {
        if (data.type === PAYMENT_METHOD_TYPE.CREDIT_CARD || data.type === PAYMENT_METHOD_TYPE.DEBIT_CARD) {
            return data.cardNumber && data.cardHolderName && data.expiryMonth && data.expiryYear;
        }
        if (data.type === PAYMENT_METHOD_TYPE.MOBILE_BANKING) {
            return data.mobileNumber;
        }
        return true;
    },
    {
        message: 'Required fields missing for payment method type',
    }
);

export const updatePaymentMethodZodValidator = z.object({
    cardHolderName: z.string().optional(),
    expiryMonth: z.number().min(1).max(12).optional(),
    expiryYear: z.number().min(new Date().getFullYear()).optional(),
    mobileNumber: z.string().regex(/^\+8801[3-9]\d{8}$/).optional(),
    bankName: z.string().optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
});
