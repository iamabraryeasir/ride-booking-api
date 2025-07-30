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

/**
 * Apply for Driver
 */
const applyForDriver = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const driverData = req.body;

    const payload = {
        ...driverData,
        user: userId,
    };

    const driver = await DriverService.applyForDriver(payload);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: 'Driver application submitted successfully',
        data: driver,
    });
});

/**
 * Approve Driver
 */
const approveDriver = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    await DriverService.approveDriver(driverId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Driver approved successfully',
        data: null,
    });
});

/**
 * Reject Driver
 */
const rejectDriver = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const { rejectionReason } = req.body;

    await DriverService.rejectDriver(driverId, rejectionReason);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Driver rejected successfully',
        data: null,
    });
});

/**
 * Toggle Driver Suspension
 */
const toggleDriverSuspension = catchAsync(
    async (req: Request, res: Response) => {
        const { driverId } = req.params;
        const isSuspended = await DriverService.toggleDriverSuspension(
            driverId
        );

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: `Driver ${
                isSuspended ? 'suspended' : 'unsuspended'
            } successfully`,
            data: { isSuspended },
        });
    }
);

/**
 * Toggle Driver Availability
 */
const toggleDriverAvailability = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const isOnline = await DriverService.toggleDriverAvailability(userId);

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: `Driver set ${
                isOnline ? 'online' : 'offline'
            } successfully`,
            data: { isOnline },
        });
    }
);

export const DriverController = {
    getAllDrivers,
    applyForDriver,
    approveDriver,
    rejectDriver,
    toggleDriverSuspension,
    toggleDriverAvailability,
};
