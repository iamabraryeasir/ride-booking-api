import { Types } from 'mongoose';

export enum APPLICATION_STATUS {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface IDriver extends Document {
    user: Types.ObjectId;
    vehicleNumber: string;
    vehicleModel: string;
    licenseNumber: string;
    isSuspended?: boolean;
    isOnline?: boolean;
    earnings?: number;
    applicationStatus?: APPLICATION_STATUS;
    rejectionReason?: string;
}
