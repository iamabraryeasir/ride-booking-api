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
    const query = req.query;
    const rides = await RideService.getAllRides(
        query as Record<string, string>
    );

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Rides fetched successfully',
        data: rides,
    });
});

/**
 * Request Ride
 */
const requestRide = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const rideData = req.body;

    const ride = await RideService.requestRide(userId, rideData);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: 'Ride requested successfully',
        data: ride,
    });
});

/**
 * Get My Rides
 */
const getMyRides = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;

    const rides = await RideService.getMyRides(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'My rides fetched successfully',
        data: rides,
    });
});

/**
 * Cancel Ride as Rider
 */
const cancelRideRider = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const { userId } = req.user;
    const { cancelReason } = req.body;

    const ride = await RideService.cancelRideRider(
        userId,
        rideId,
        cancelReason
    );

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride cancelled successfully',
        data: ride,
    });
});

/**
 * Accept Ride
 */
const acceptRide = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const userId = req.user.userId;

    const ride = await RideService.acceptRide(rideId, userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride accepted successfully',
        data: ride,
    });
});

/**
 * Reject Ride
 */
const rejectRide = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const userId = req.user.userId;
    const { reason } = req.body;

    const ride = await RideService.rejectRide(rideId, userId, reason);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride rejected successfully',
        data: ride,
    });
});

/**
 * Update Ride Status
 */
const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    const ride = await RideService.updateRideStatus(rideId, userId, status);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride status updated successfully',
        data: ride,
    });
});

/**
 * Get Ride Detail
 */
const getRideDetail = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const { userId, role } = req.user;

    const ride = await RideService.getRideDetail(rideId, userId, role);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ride details fetched successfully',
        data: ride,
    });
});

/**
 * Get Incoming Ride Requests for Drivers
 */
const getIncomingRideRequests = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;

    const rides = await RideService.getIncomingRideRequests(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Incoming ride requests fetched successfully',
        data: rides,
    });
});

/**
 * Estimate Fare
 */
const estimateFare = catchAsync(async (req: Request, res: Response) => {
    const { pickupAddress, destinationAddress } = req.body;

    const fareEstimation = await RideService.estimateFare(pickupAddress, destinationAddress);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Fare estimated successfully',
        data: fareEstimation,
    });
});

export const RideController = {
    getAllRides,
    requestRide,
    getMyRides,
    cancelRideRider,
    acceptRide,
    rejectRide,
    updateRideStatus,
    getRideDetail,
    getIncomingRideRequests,
    estimateFare,
};
