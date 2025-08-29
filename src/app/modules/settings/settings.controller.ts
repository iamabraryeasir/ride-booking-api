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
import { SettingsService } from './settings.service';

/**
 * Get User Settings
 */
const getUserSettings = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const settings = await SettingsService.getUserSettings(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Settings fetched successfully',
        data: settings,
    });
});

/**
 * Update User Settings
 */
const updateUserSettings = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const settings = await SettingsService.updateUserSettings(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Settings updated successfully',
        data: settings,
    });
});

/**
 * Reset User Settings
 */
const resetUserSettings = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const settings = await SettingsService.resetUserSettings(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Settings reset to default successfully',
        data: settings,
    });
});

export const SettingsController = {
    getUserSettings,
    updateUserSettings,
    resetUserSettings,
};
