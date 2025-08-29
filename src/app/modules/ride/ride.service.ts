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
import { Driver } from '../driver/driver.model';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { rideSearchableFields } from './ride.contant';

/**
 * Get All Rides
 */
const getAllRides = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Ride.find(), query);
    const driversData = queryBuilder
        .filter()
        .search(rideSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        driversData.build(),
        queryBuilder.getMeta(),
    ]);

    return {
        data,
        meta,
    };
};

/**
 * Request Ride
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Accept Ride
 */
const acceptRide = async (rideId: string, userId: string) => {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    if (!driver.isOnline) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Driver is not available to accept rides'
        );
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    if (ride.status !== RIDE_STATUS.REQUESTED) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Ride is not available for acceptance'
        );
    }

    ride.status = RIDE_STATUS.ACCEPTED;
    ride.driver = driver._id;
    ride.timestamps.acceptedAt = new Date();
    await ride.save();

    return ride.populate('driver', 'user');
};

/**
 * Reject Ride
 */
const rejectRide = async (rideId: string, userId: string, reason: string) => {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    if (ride.status !== RIDE_STATUS.REQUESTED) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Ride is not available for rejection'
        );
    }

    ride.rejectionDriverList?.push({
        driverId: driver._id,
        reason,
        timestamp: new Date(),
    });
    await ride.save();

    return ride.populate('driver', 'user');
};

/**
 * Update Ride Status
 */
const updateRideStatus = async (
    rideId: string,
    userId: string,
    status: RIDE_STATUS
) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    if (
        ride.status === RIDE_STATUS.COMPLETED ||
        ride.status === RIDE_STATUS.CANCELLED
    ) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Ride has already been completed or cancelled'
        );
    }

    if (ride.status === RIDE_STATUS.REQUESTED) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Ride must be accepted before updating status'
        );
    }

    if (ride.driver?.toString() !== userId) {
        throw new AppError(
            httpStatusCodes.FORBIDDEN,
            'You can only update your own rides'
        );
    }

    if (status === RIDE_STATUS.PICKED_UP) {
        ride.timestamps.pickedUpAt = new Date();
    } else if (status === RIDE_STATUS.COMPLETED) {
        ride.timestamps.completedAt = new Date();
        
        // Update driver earnings when ride is completed
        const driver = await Driver.findById(ride.driver);
        if (driver) {
            driver.earnings = (driver.earnings || 0) + ride.price;
            await driver.save();
        }
    }

    ride.status = status;
    await ride.save();

    return ride.populate('driver', 'user');
};

/**
 * Get Ride Detail
 */
const getRideDetail = async (rideId: string, userId: string, userRole: string) => {
    const ride = await Ride.findById(rideId)
        .populate('rider', 'name email phone picture')
        .populate({
            path: 'driver',
            populate: {
                path: 'user',
                select: 'name email phone picture'
            }
        });

    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    // Authorization check - users can only view their own rides unless they're admin
    if (userRole !== 'ADMIN') {
        const isRider = (ride.rider as any)._id.toString() === userId;
        const isDriver = ride.driver && (ride.driver as any).user && (ride.driver as any).user._id.toString() === userId;
        
        if (!isRider && !isDriver) {
            throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only view your own rides');
        }
    }

    return ride;
};

/**
 * Get Incoming Ride Requests for Drivers
 */
const getIncomingRideRequests = async (userId: string) => {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    if (!driver.isOnline) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Driver must be online to view incoming requests'
        );
    }

    if (driver.isSuspended) {
        throw new AppError(
            httpStatusCodes.FORBIDDEN,
            'Driver is suspended and cannot view incoming requests'
        );
    }

    // Get rides that are requested and not rejected by this driver
    const rides = await Ride.find({
        status: RIDE_STATUS.REQUESTED,
        'rejectionDriverList.driverId': { $ne: driver._id },
    })
        .populate('rider', 'name email phone picture')
        .sort({ 'timestamps.requestedAt': -1 });

    return rides;
};

/**
 * Estimate Fare
 */
const estimateFare = async (pickupAddress: string, destinationAddress: string) => {
    // Simple fare calculation based on address strings
    // In production, you would use actual map APIs like Google Maps or Mapbox
    const baseRate = 50; // Base fare in BDT
    const perKmRate = 15; // Rate per kilometer
    
    // Simulate distance calculation based on address complexity
    // This is a simplified approach - in production you'd use GPS coordinates
    const estimatedDistance = Math.max(
        Math.abs(pickupAddress.length - destinationAddress.length) * 0.1,
        2
    ); // Minimum 2km
    
    const estimatedFare = baseRate + (estimatedDistance * perKmRate);
    
    return {
        estimatedFare: Math.round(estimatedFare),
        estimatedDistance: Math.round(estimatedDistance * 10) / 10,
        estimatedDuration: Math.round(estimatedDistance * 3), // Assume 3 minutes per km
        breakdown: {
            baseFare: baseRate,
            distanceFare: Math.round(estimatedDistance * perKmRate),
            totalFare: Math.round(estimatedFare)
        }
    };
};

export const RideService = {
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
