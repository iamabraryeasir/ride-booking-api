/**
 * Node Modules
 */
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

/**
 * Get User Payment Methods
 */
const getUserPaymentMethods = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const paymentMethods = await PaymentService.getUserPaymentMethods(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Payment methods fetched successfully',
        data: paymentMethods,
    });
});

/**
 * Create Payment Method
 */
const createPaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const paymentMethod = await PaymentService.createPaymentMethod(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: 'Payment method created successfully',
        data: paymentMethod,
    });
});

/**
 * Update Payment Method
 */
const updatePaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { paymentMethodId } = req.params;
    
    const paymentMethod = await PaymentService.updatePaymentMethod(userId, paymentMethodId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Payment method updated successfully',
        data: paymentMethod,
    });
});

/**
 * Delete Payment Method
 */
const deletePaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { paymentMethodId } = req.params;
    
    const result = await PaymentService.deletePaymentMethod(userId, paymentMethodId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: result.message,
        data: null,
    });
});

export const PaymentController = {
    getUserPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
};
