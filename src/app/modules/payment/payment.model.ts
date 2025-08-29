/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { IPaymentMethod, PAYMENT_METHOD_TYPE } from './payment.interface';

/**
 * Payment Method Schema
 */
const paymentMethodSchema = new Schema<IPaymentMethod>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(PAYMENT_METHOD_TYPE),
            required: true,
        },
        cardNumber: {
            type: String,
            trim: true,
        },
        cardHolderName: {
            type: String,
            trim: true,
        },
        expiryMonth: {
            type: Number,
            min: 1,
            max: 12,
        },
        expiryYear: {
            type: Number,
            min: new Date().getFullYear(),
        },
        mobileNumber: {
            type: String,
            trim: true,
        },
        bankName: {
            type: String,
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * Indexes
 */
paymentMethodSchema.index({ user: 1, isDefault: 1 });

export const PaymentMethod = model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);
