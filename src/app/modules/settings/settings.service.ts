/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IUserSettings } from './settings.interface';
import { UserSettings } from './settings.model';
import { User } from '../user/user.model';

/**
 * Get User Settings
 */
const getUserSettings = async (userId: string) => {
    let settings = await UserSettings.findOne({ user: userId });

    // If settings don't exist, create default settings
    if (!settings) {
        settings = await UserSettings.create({ user: userId });
    }

    return settings;
};

/**
 * Update User Settings
 */
const updateUserSettings = async (userId: string, payload: Partial<IUserSettings>) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'User is blocked');
    }

    let settings = await UserSettings.findOne({ user: userId });

    if (!settings) {
        // Create new settings if they don't exist
        settings = await UserSettings.create({
            user: userId,
            ...payload,
        });
    } else {
        // Update existing settings
        if (payload.notifications) {
            Object.assign(settings.notifications, payload.notifications);
        }
        if (payload.privacy) {
            Object.assign(settings.privacy, payload.privacy);
        }
        if (payload.language) {
            settings.language = payload.language;
        }
        if (payload.currency) {
            settings.currency = payload.currency;
        }
        if (payload.timezone) {
            settings.timezone = payload.timezone;
        }
        
        await settings.save();
    }

    return settings;
};

/**
 * Reset User Settings to Default
 */
const resetUserSettings = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'User is blocked');
    }

    // Delete existing settings and let the system create defaults
    await UserSettings.findOneAndDelete({ user: userId });
    
    const newSettings = await UserSettings.create({ user: userId });

    return newSettings;
};

export const SettingsService = {
    getUserSettings,
    updateUserSettings,
    resetUserSettings,
};
