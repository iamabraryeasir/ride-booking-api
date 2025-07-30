import { Types } from 'mongoose';

export enum RIDE_STATUS {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface IRide extends Document {
    rider: Types.ObjectId;
    driver: Types.ObjectId | null;
    pickupAddress: string;
    destinationAddress: string;
    status: RIDE_STATUS;
    price: number;
    timestamps: {
        requestedAt: Date;
        acceptedAt?: Date;
        pickedUpAt?: Date;
        completedAt?: Date;
        cancelledAt?: Date;
    };
    cancelReason?: string;
    rejectionDriverList?: {
        driverId: Types.ObjectId;
        reason: string;
        timestamp: Date;
    }[];
}
