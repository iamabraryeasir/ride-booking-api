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

/**
 * Get All Drivers
 */
const getAllDrivers = async () => {
    const drivers = await Driver.find({}).populate('user', 'name email phone');
    return drivers;
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
        throw new Error('Driver not found');
    }

    if (driver.applicationStatus !== APPLICATION_STATUS.PENDING) {
        throw new Error('Driver application is not pending');
    }

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

export const DriverService = {
    getAllDrivers,
    applyForDriver,
    approveDriver,
    rejectDriver,
    toggleDriverSuspension,
};
