/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { IUserSettings, INotificationSettings, IPrivacySettings } from './settings.interface';

/**
 * Notification Settings Schema
 */
const notificationSettingsSchema = new Schema<INotificationSettings>(
    {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        rideUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        emergencyAlerts: { type: Boolean, default: true },
    },
    { _id: false }
);

/**
 * Privacy Settings Schema
 */
const privacySettingsSchema = new Schema<IPrivacySettings>(
    {
        shareLocation: { type: Boolean, default: true },
        sharePhoneNumber: { type: Boolean, default: false },
        shareRideHistory: { type: Boolean, default: false },
    },
    { _id: false }
);

/**
 * User Settings Schema
 */
const userSettingsSchema = new Schema<IUserSettings>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        notifications: {
            type: notificationSettingsSchema,
            default: () => ({}),
        },
        privacy: {
            type: privacySettingsSchema,
            default: () => ({}),
        },
        language: {
            type: String,
            default: 'en',
            enum: ['en', 'bn'],
        },
        currency: {
            type: String,
            default: 'BDT',
            enum: ['BDT', 'USD'],
        },
        timezone: {
            type: String,
            default: 'Asia/Dhaka',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const UserSettings = model<IUserSettings>('UserSettings', userSettingsSchema);
