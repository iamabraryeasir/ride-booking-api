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
 * Request a ride
 */
const requestRide = catchAsync(async (req: Request, res: Response) => {
    const rider = req.user.userId;

    const payload = {
        ...req.body,
        rider,
    };

    const ride = await RideService.requestRide(payload);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride requested successfully',
        data: ride,
    });
});

/**
 * Cancel a ride
 */
const cancelRide = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const rider = req.user.userId;
    const cancelReason = req.body.cancelReason;

    await RideService.cancelRide(rideId, rider, cancelReason);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride cancelled successfully',
        data: null,
    });
});

export const RideController = {
    requestRide,
    cancelRide,
};
