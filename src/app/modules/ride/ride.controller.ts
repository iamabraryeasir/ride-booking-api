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
import { RideService } from './ride.service';

/**
 * Get All Rides
 */
const getAllRides = catchAsync(async (req: Request, res: Response) => {
    const rides = await RideService.getAllRides();

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Rides fetched successfully',
        data: rides,
    });
});

export const RideController = {
    getAllRides,
};
