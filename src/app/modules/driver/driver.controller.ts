/**
 * Node Modules
 */
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { DriverService } from './driver.service';
import { sendResponse } from '../../utils/sendResponse';

/**
 * Get All Drivers
 */
const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.getAllDrivers();

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Drivers fetched successfully',
        data: drivers,
    });
});

export const DriverController = {
    getAllDrivers,
};
