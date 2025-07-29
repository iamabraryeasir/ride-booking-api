/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { rideRequestZodValidator } from './ride.validator';
import { RideController } from './ride.controller';

/**
 * Ride Routes
 */
const router = Router();

router.post(
    '/request-ride',
    checkAuth(Role.RIDER),
    validateRequest(rideRequestZodValidator),
    RideController.requestRide
);

export const RideRoutes = router;
