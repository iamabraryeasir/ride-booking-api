/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { Types } from 'mongoose';
import { IRide, RideStatus } from './ride.interface';
import { Ride } from './ride.model';
import { AppError } from '../../errorHelpers/AppError';

/**
 * Request a ride
 */
const requestRide = async (rideData: Partial<IRide>) => {
    const { rider, pickupAddress, destinationAddress, price } = rideData;

    const newRide = await Ride.create({
        rider,
        pickupAddress,
        destinationAddress,
        price,
    });

    return newRide;
};

/**
 * Cancel a ride
 */
const cancelRide = async (rideId: string, riderId: string) => {
    const ride = await Ride.findOne({ _id: rideId, rider: riderId });

    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    if (ride.rider.toString() !== riderId) {
        throw new AppError(
            httpStatusCodes.UNAUTHORIZED,
            'You are not authorized to cancel this ride'
        );
    }

    await Ride.findByIdAndUpdate(
        rideId,
        { status: RideStatus.CANCELLED },
        { new: true, runValidators: true }
    );
};

export const RideService = { requestRide, cancelRide };
