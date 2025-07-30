/**
 * Node Modules
 */
import { Schema, model } from 'mongoose';

/**
 * Local Modules
 */
import { IRide, RIDE_STATUS } from './ride.interface';

/**
 * Ride Schema
 */
const rideSchema = new Schema<IRide>(
    {
        rider: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        driver: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
        pickupAddress: { type: String, required: true },
        destinationAddress: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(RIDE_STATUS),
            default: RIDE_STATUS.REQUESTED,
        },
        price: { type: Number, required: true },
        timestamps: {
            requestedAt: { type: Date, default: Date.now },
            acceptedAt: { type: Date },
            pickedUpAt: { type: Date },
            completedAt: { type: Date },
            cancelledAt: { type: Date },
        },
        cancelReason: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * Ride Model
 */
export const Ride = model<IRide>('Ride', rideSchema);
