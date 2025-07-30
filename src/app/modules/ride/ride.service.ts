/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { Ride } from './ride.model';
import { User } from '../user/user.model';
import { AppError } from '../../errorHelpers/AppError';
import { RIDE_STATUS } from './ride.interface';

/**
 * Get All Rides
 */
const getAllRides = async () => {
    const rides = await Ride.find({})
        .populate('rider', 'name email')
        .populate('driver', 'user');

    return rides;
};

/**
 * Request Ride
 */
const requestRide = async (userId: string, rideData: any) => {
    const rider = await User.findById(userId);
    if (!rider) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Rider not found');
    }

    if (rider.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'Rider is blocked');
    }

    const ride = new Ride({
        ...rideData,
        rider: userId,
    });

    await ride.save();

    return ride.populate('rider', 'name email');
};

/**
 * Get My Rides
 */
const getMyRides = async (userId: string) => {
    const rides = await Ride.find({ rider: userId })
        .populate('rider', 'name email')
        .populate('driver', 'name email');

    if (!rides.length) {
        throw new AppError(
            httpStatusCodes.NOT_FOUND,
            'No rides found for this user'
        );
    }

    return rides;
};

/**
 * Cancel Ride as Rider
 */
const cancelRideRider = async (
    userId: string,
    rideId: string,
    cancelReason?: string
) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    if (ride.rider.toString() !== userId) {
        throw new AppError(
            httpStatusCodes.FORBIDDEN,
            'You can only cancel your own rides'
        );
    }

    if (ride.status !== RIDE_STATUS.REQUESTED) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Only requested rides can be cancelled'
        );
    }

    ride.status = RIDE_STATUS.CANCELLED;
    ride.cancelReason = cancelReason;
    ride.timestamps.cancelledAt = new Date();

    await ride.save();

    return ride.populate('rider', 'name email');
};

export const RideService = {
    getAllRides,
    requestRide,
    getMyRides,
    cancelRideRider,
};
