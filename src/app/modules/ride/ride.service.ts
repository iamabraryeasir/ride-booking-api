/**
 * Node Modules
 */

import e from 'cors';
import { Ride } from './ride.model';

/**
 * Local Modules
 */

/**
 * Get All Rides
 */
const getAllRides = async () => {
    const rides = await Ride.find({})
        .populate('rider', 'name email')
        .populate('driver', 'user');

    return rides;
};

export const RideService = {
    getAllRides,
};
