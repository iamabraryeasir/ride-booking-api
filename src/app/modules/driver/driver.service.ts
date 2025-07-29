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
 * Apply To Become a Driver
 */
const applyForDriver = async (payload: Partial<IDriver>) => {
    const existingDriver = await Driver.findOne({ user: payload.user });
    if (existingDriver) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'You have already applied to become a driver'
        );
    }

    const driverApplyData = await Driver.create(payload);
    return driverApplyData;
};

/**
 * Get All Pending Drivers
 */
const getAllPendingDrivers = async () => {
    const allPendingDrivers = await Driver.find({
        applicationStatus: APPLICATION_STATUS.PENDING,
    })
        .populate('user', 'name email picture')
        .select('-createdAt -updatedAt -earnings -isOnline -rejectionReason');

    return allPendingDrivers;
};

export const DriverService = { applyForDriver, getAllPendingDrivers };
