import { Types, Document } from 'mongoose';

export interface INotificationSettings {
    email: boolean;
    sms: boolean;
    push: boolean;
    rideUpdates: boolean;
    promotions: boolean;
    emergencyAlerts: boolean;
}

export interface IPrivacySettings {
    shareLocation: boolean;
    sharePhoneNumber: boolean;
    shareRideHistory: boolean;
}

export interface IUserSettings extends Document {
    user: Types.ObjectId;
    notifications: INotificationSettings;
    privacy: IPrivacySettings;
    language: string;
    currency: string;
    timezone: string;
}
