/**
 * Node Modules
 */

/**
 * Local Modules
 */
import { Driver } from './driver.model';

/**
 * Get All Drivers
 */
const getAllDrivers = async () => {
    const drivers = await Driver.find({}).populate('user', 'name email phone');
    return drivers;
};

export const DriverService = {
    getAllDrivers,
};
