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

/**
 * Get All Pending Drivers
 */
const getAllPendingDrivers = catchAsync(async (req: Request, res: Response) => {
    const pendingDrivers = await DriverService.getAllPendingDrivers();

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'All Pending Drivers Fetched Successfully',
        data: pendingDrivers,
    });
});

export const DriverController = { applyForDriver, getAllPendingDrivers };
