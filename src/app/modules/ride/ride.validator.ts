import z from 'zod';
import { RIDE_STATUS } from './ride.interface';

export const rideRequestZodValidator = z.object({
    pickupAddress: z.string().min(1, 'Pickup address is required'),
    destinationAddress: z.string().min(1, 'Destination address is required'),
    price: z.number().positive('Price must be a positive number'),
});

export const rideCancelZodValidator = z.object({
    cancelReason: z.string().min(1, 'Cancel reason is required'),
});

export const updateRideStatusZodValidator = z.object({
    status: z.enum(Object.values(RIDE_STATUS)),
});

export const fareEstimationZodValidator = z.object({
    pickupAddress: z.string().min(1, 'Pickup address is required'),
    destinationAddress: z.string().min(1, 'Destination address is required'),
});
