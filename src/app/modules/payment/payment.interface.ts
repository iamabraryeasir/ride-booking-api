import { Types, Document } from 'mongoose';

export enum PAYMENT_METHOD_TYPE {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    MOBILE_BANKING = 'MOBILE_BANKING',
    CASH = 'CASH',
}

export interface IPaymentMethod extends Document {
    user: Types.ObjectId;
    type: PAYMENT_METHOD_TYPE;
    cardNumber?: string;
    cardHolderName?: string;
    expiryMonth?: number;
    expiryYear?: number;
    mobileNumber?: string;
    bankName?: string;
    isDefault: boolean;
    isActive: boolean;
}
