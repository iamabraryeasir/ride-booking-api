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
import {
    rideCancelZodValidator,
    rideRequestZodValidator,
} from './ride.validator';
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

router.patch(
    '/cancel-ride/:rideId',
    checkAuth(Role.RIDER, Role.DRIVER),
    validateRequest(rideCancelZodValidator),
    RideController.cancelRide
);

export const RideRoutes = router;
