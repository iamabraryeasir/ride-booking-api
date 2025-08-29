/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { APPLICATION_STATUS, IDriver } from './driver.interface';
import { Driver } from './driver.model';
import { User } from '../user/user.model';
import { ROLE } from '../user/user.interface';
import { Ride } from '../ride/ride.model';
import { RIDE_STATUS } from '../ride/ride.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { driverSearchableFields } from './driver.constant';

/**
 * Get All Drivers
 */
const getAllDrivers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Driver.find(), query);
    const driversData = queryBuilder
        .filter()
        .search(driverSearchableFields)
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
 * Apply for Driver
 */
const applyForDriver = async (payload: Partial<IDriver>) => {
    const existingDriver = await Driver.findOne({ user: payload.user });
    if (
        existingDriver &&
        existingDriver.applicationStatus === APPLICATION_STATUS.APPROVED
    ) {
        throw new AppError(
            httpStatusCodes.CONFLICT,
            'User is already a driver'
        );
    }

    if (
        existingDriver &&
        existingDriver.applicationStatus === APPLICATION_STATUS.PENDING
    ) {
        throw new AppError(
            httpStatusCodes.CONFLICT,
            'Driver application is already pending'
        );
    }

    const driver = await Driver.create({
        ...payload,
        applicationStatus: APPLICATION_STATUS.PENDING,
    });

    return driver;
};

/**
 * Approve Driver
 */
const approveDriver = async (driverId: string) => {
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.PENDING) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Driver application is not pending'
        );
    }

    await User.findByIdAndUpdate(driver.user, {
        role: ROLE.DRIVER,
    });

    driver.applicationStatus = APPLICATION_STATUS.APPROVED;
    await driver.save();
};

/**
 * Reject Driver
 */
const rejectDriver = async (driverId: string, rejectionReason: string) => {
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new Error('Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.PENDING) {
        throw new Error('Driver application is not pending');
    }

    driver.applicationStatus = APPLICATION_STATUS.REJECTED;
    driver.rejectionReason = rejectionReason;
    await driver.save();
};

/**
 * Toggle Driver Suspension
 */
const toggleDriverSuspension = async (driverId: string) => {
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new Error('Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.APPROVED) {
        throw new Error('Driver must be approved to toggle suspension');
    }

    driver.isSuspended = !driver.isSuspended;
    await driver.save();
    return driver.isSuspended;
};

/**
 * Toggle Driver Availability
 */
const toggleDriverAvailability = async (userId: string) => {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.APPROVED) {
        throw new Error('Driver must be approved to toggle availability');
    }

    driver.isOnline = !driver.isOnline;
    await driver.save();
    return driver.isOnline;
};

/**
 * Get Driver Earnings
 */
const getDriverEarnings = async (userId: string) => {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.APPROVED) {
        throw new Error('Driver must be approved to view earnings');
    }

    const rides = await Ride.find({
        driver: driver._id,
        status: RIDE_STATUS.COMPLETED,
    });

    const totalEarnings = rides.reduce((total, ride) => total + ride.price, 0);

    return { rides, totalEarnings };
};

/**
 * Get Driver Ride History
 */
const getDriverRideHistory = async (userId: string, query: Record<string, string>) => {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.APPROVED) {
        throw new AppError(
            httpStatusCodes.FORBIDDEN,
            'Driver must be approved to view ride history'
        );
    }

    const queryBuilder = new QueryBuilder(
        Ride.find({ driver: driver._id }),
        query
    );
    
    const ridesData = queryBuilder
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        ridesData.build().populate('rider', 'name email phone picture'),
        queryBuilder.getMeta(),
    ]);

    return {
        data,
        meta,
    };
};

export const DriverService = {
    getAllDrivers,
    applyForDriver,
    approveDriver,
    rejectDriver,
    toggleDriverSuspension,
    toggleDriverAvailability,
    getDriverEarnings,
    getDriverRideHistory,
};
