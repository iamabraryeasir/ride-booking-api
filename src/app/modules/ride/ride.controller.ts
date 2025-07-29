import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RideService } from './ride.service';

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

export const RideController = {
    requestRide,
};
