/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { RideController } from './ride.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import {
    rideCancelZodValidator,
    rideRequestZodValidator,
    updateRideStatusZodValidator,
} from './ride.validator';

/**
 * Routes
 */
const router = Router();

router.get('/', checkAuth(ROLE.ADMIN), RideController.getAllRides);

router.post(
    '/request',
    checkAuth(ROLE.RIDER),
    validateRequest(rideRequestZodValidator),
    RideController.requestRide
);

router.get('/my-rides', checkAuth(ROLE.RIDER), RideController.getMyRides);

router.patch(
    '/cancel/:rideId',
    checkAuth(ROLE.RIDER),
    validateRequest(rideCancelZodValidator),
    RideController.cancelRideRider
);

router.patch(
    '/accept/:rideId',
    checkAuth(ROLE.DRIVER),
    RideController.acceptRide
);

router.patch(
    '/reject/:rideId',
    checkAuth(ROLE.DRIVER),
    RideController.rejectRide
);

router.patch(
    '/update-ride-status/:rideId',
    checkAuth(ROLE.DRIVER),
    validateRequest(updateRideStatusZodValidator),
    RideController.updateRideStatus
);

export const RideRoutes = router;
