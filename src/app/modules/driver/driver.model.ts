/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { APPLICATION_STATUS, IDriver } from './driver.interface';

/**
 * Driver Schema
 */
const driverSchema = new Schema<IDriver>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vehicleNumber: {
            type: String,
            trim: true,
            unique: [true, 'Vehicle number is already in use'],
        },
        vehicleModel: String,
        licenseNumber: {
            type: String,
            trim: true,
            unique: [true, 'License number is already in use'],
        },
        applicationStatus: {
            type: String,
            enum: Object.values(APPLICATION_STATUS),
            default: APPLICATION_STATUS.PENDING,
        },
        rejectionReason: {
            type: String,
            default: null,
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },
        isOnline: {
            type: Boolean,
            default: true,
        },
        earnings: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, versionKey: false }
);

export const Driver = model<IDriver>('Driver', driverSchema);
