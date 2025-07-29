import httpStatusCodes from 'http-status-codes';

import { AppError } from '../../errorHelpers/AppError';
import { IDriver } from './driver.interface';
import { Driver } from './driver.model';

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

export const DriverService = { applyForDriver };
