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
const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.getAllDrivers();

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'All Drivers Fetched Successfully',
        data: drivers,
    });
});

/**
 * Approve Driver Application
 */
const approveDriverApplication = catchAsync(
    async (req: Request, res: Response) => {
        const { applicationId } = req.params;

        const approvedDriver = await DriverService.approveDriverApplication(
            applicationId
        );

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Driver request is approved',
            data: approvedDriver?.user,
        });
    }
);

/**
 * Reject Driver Application
 */
const rejectDriverApplication = catchAsync(
    async (req: Request, res: Response) => {
        const { applicationId } = req.params;
        const { rejectionReason } = req.body;

        const rejectedDriver = await DriverService.rejectDriverApplication(
            applicationId,
            rejectionReason
        );

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Driver request is rejected',
            data: {
                rejectionReason: rejectedDriver?.rejectionReason,
                user: rejectedDriver?.user,
            },
        });
    }
);

/**
 * Reject Driver Application
 */
const toggleSuspend = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;

    const driver = await DriverService.toggleSuspend(driverId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: `User is ${driver?.isSuspended ? 'Suspend' : 'Unsuspend'}`,
        data: {
            isSuspended: driver?.isSuspended,
            user: driver?.user,
        },
    });
});

export const DriverController = {
    applyForDriver,
    getAllDrivers,
    approveDriverApplication,
    rejectDriverApplication,
    toggleSuspend,
};
