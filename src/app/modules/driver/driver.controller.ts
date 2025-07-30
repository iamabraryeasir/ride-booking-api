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

/**
 * Get All Drivers
 */
const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.getAllDrivers();

    res.status(httpStatusCodes.OK).json({
        success: true,
        data: drivers,
    });
});

export const DriverController = {
    getAllDrivers,
};
