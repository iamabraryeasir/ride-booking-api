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
import { DriverService } from './driver.service';

/**
 * Apply For Becoming a Driver
 */
const applyForDriver = catchAsync(async (req: Request, res: Response) => {
    const user = req.user.userId;

    const payload = {
        ...req.body,
        user,
    };

    const { vehicleModel, vehicleNumber, applicationStatus, licenseNumber } =
        await DriverService.applyForDriver(payload);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Applied for Diver Successfully',
        data: {
            licenseNumber,
            vehicleModel,
            vehicleNumber,
            applicationStatus,
        },
    });
});

export const DriverController = { applyForDriver };
