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
const cancelRide = async (
    rideId: string,
    riderId: string,
    cancelReason: string
) => {
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

    if (ride.status === RideStatus.ACCEPTED) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Ride cannot be canceled after being accepted by a driver'
        );
    }

    await Ride.findByIdAndUpdate(
        rideId,
        { status: RideStatus.CANCELLED, cancelReason },
        { new: true, runValidators: true }
    );
};

/**
 * Get rides for a rider
 */
const getMyRides = async (riderId: string) => {
    const rides = await Ride.find({ rider: new Types.ObjectId(riderId) })
        .populate('rider', 'name email')
        .populate('driver', 'name email');

    if (!rides || rides.length === 0) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'No rides found');
    }

    return rides;
};

export const RideService = { requestRide, cancelRide, getMyRides };
