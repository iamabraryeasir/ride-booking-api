/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IPaymentMethod } from './payment.interface';
import { PaymentMethod } from './payment.model';
import { User } from '../user/user.model';

/**
 * Get User Payment Methods
 */
const getUserPaymentMethods = async (userId: string) => {
    const paymentMethods = await PaymentMethod.find({ 
        user: userId, 
        isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });

    return paymentMethods;
};

/**
 * Create Payment Method
 */
const createPaymentMethod = async (userId: string, payload: Partial<IPaymentMethod>) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'User is blocked');
    }

    // If this is set as default, unset other default payment methods
    if (payload.isDefault) {
        await PaymentMethod.updateMany(
            { user: userId, isDefault: true },
            { isDefault: false }
        );
    }

    // Mask card number for security (store only last 4 digits)
    if (payload.cardNumber) {
        const maskedCardNumber = '**** **** **** ' + payload.cardNumber.slice(-4);
        payload.cardNumber = maskedCardNumber;
    }

    const paymentMethod = await PaymentMethod.create({
        ...payload,
        user: userId,
    });

    return paymentMethod;
};

/**
 * Update Payment Method
 */
const updatePaymentMethod = async (userId: string, paymentMethodId: string, payload: Partial<IPaymentMethod>) => {
    const paymentMethod = await PaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Payment method not found');
    }

    if (paymentMethod.user.toString() !== userId) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only update your own payment methods');
    }

    // If this is set as default, unset other default payment methods
    if (payload.isDefault) {
        await PaymentMethod.updateMany(
            { user: userId, isDefault: true, _id: { $ne: paymentMethodId } },
            { isDefault: false }
        );
    }

    Object.assign(paymentMethod, payload);
    await paymentMethod.save();

    return paymentMethod;
};

/**
 * Delete Payment Method
 */
const deletePaymentMethod = async (userId: string, paymentMethodId: string) => {
    const paymentMethod = await PaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Payment method not found');
    }

    if (paymentMethod.user.toString() !== userId) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only delete your own payment methods');
    }

    // Soft delete by setting isActive to false
    paymentMethod.isActive = false;
    await paymentMethod.save();

    // If this was the default payment method, set another one as default
    if (paymentMethod.isDefault) {
        const nextPaymentMethod = await PaymentMethod.findOne({
            user: userId,
            isActive: true,
            _id: { $ne: paymentMethodId }
        });
        
        if (nextPaymentMethod) {
            nextPaymentMethod.isDefault = true;
            await nextPaymentMethod.save();
        }
    }

    return { message: 'Payment method deleted successfully' };
};

export const PaymentService = {
    getUserPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
};
