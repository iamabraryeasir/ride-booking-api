import z from 'zod';

export const rideRequestZodValidator = z.object({
    pickupAddress: z.string().min(1, 'Pickup address is required'),
    destinationAddress: z.string().min(1, 'Destination address is required'),
    price: z.number().positive('Price must be a positive number'),
});
