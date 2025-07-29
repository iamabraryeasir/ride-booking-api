import { IRide } from './ride.interface';
import { Ride } from './ride.model';

const requestRide = async (rideData: Partial<IRide>) => {
    const { rider, pickupAddress, destinationAddress, price } = rideData;

    const newRide = await Ride.create({
        rider,
        pickupAddress,
        destinationAddress,
        price,
    });

    return newRide;
};

export const RideService = { requestRide };
