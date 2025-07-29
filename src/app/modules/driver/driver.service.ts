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
import { IUser } from '../user/user.interface';

/**
 * Apply To Become a Driver
 */
const applyForDriver = async (payload: Partial<IDriver>) => {
    const existingDriver = await Driver.findOne({
        user: payload.user,
    }).populate('user');

    if ((existingDriver?.user as unknown as IUser)?.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'The user is blocked');
    }

    if (existingDriver?.applicationStatus === APPLICATION_STATUS.PENDING) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'You have already applied to become a driver'
        );
    }

    if (existingDriver?.applicationStatus === APPLICATION_STATUS.APPROVED) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'You are already a driver'
        );
    }

    const driverApplyData = await Driver.create(payload);
    return driverApplyData;
};

/**
 * Get All Pending Drivers
 */
const getAllDrivers = async () => {
    const allPendingDrivers = await Driver.find({})
        .populate('user', 'name email picture')
        .select('-createdAt -updatedAt -earnings -isOnline -rejectionReason');

    return allPendingDrivers;
};

/**
 * Approve Driver Application
 */
const approveDriverApplication = async (applicationId: string) => {
    // Find the current suspension status
    const driver = await Driver.findById(applicationId);
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    // update
    const updatedApplication = await Driver.findByIdAndUpdate(
        applicationId,
        {
            applicationStatus: APPLICATION_STATUS.APPROVED,
        },
        { runValidators: true, new: true }
    ).populate('user', 'name email');

    return updatedApplication;
};

/**
 * Approve Driver Application
 */
const rejectDriverApplication = async (
    applicationId: string,
    rejectionReason: string
) => {
    // Find the current suspension status
    const driver = await Driver.findById(applicationId);
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    // update
    const updatedApplication = await Driver.findByIdAndUpdate(
        applicationId,
        {
            rejectionReason,
            applicationStatus: APPLICATION_STATUS.REJECTED,
        },
        { runValidators: true, new: true }
    ).populate('user', 'name email');

    return updatedApplication;
};

/**
 * Approve Driver Application
 */
const toggleSuspend = async (driverId: string) => {
    // Find the current suspension status
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Driver not found');
    }

    // Toggle the isSuspended field
    const updatedApplication = await Driver.findByIdAndUpdate(
        driverId,
        {
            isSuspended: !driver.isSuspended,
        },
        { runValidators: true, new: true }
    ).populate('user', 'name email');

    return updatedApplication;
};

export const DriverService = {
    applyForDriver,
    getAllDrivers,
    approveDriverApplication,
    rejectDriverApplication,
    toggleSuspend,
};
