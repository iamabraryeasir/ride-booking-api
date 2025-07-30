/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { DriverController } from './driver.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import {
    applyForDriverZodValidator,
    rejectedDriverApplicationZodValidator,
} from './driver.validator';

/**
 * Driver Routes
 */
const router = Router();

router.get('/', checkAuth(ROLE.ADMIN), DriverController.getAllDrivers);

router.post(
    '/apply',
    checkAuth(ROLE.RIDER),
    validateRequest(applyForDriverZodValidator),
    DriverController.applyForDriver
);

router.patch(
    '/approve/:driverId',
    checkAuth(ROLE.ADMIN),
    DriverController.approveDriver
);

router.patch(
    '/reject/:driverId',
    checkAuth(ROLE.ADMIN),
    validateRequest(rejectedDriverApplicationZodValidator),
    DriverController.rejectDriver
);

router.patch(
    '/toggle-suspend/:driverId',
    checkAuth(ROLE.ADMIN),
    DriverController.toggleDriverSuspension
);

router.patch(
    '/toggle-availability',
    checkAuth(ROLE.DRIVER),
    DriverController.toggleDriverAvailability
);

export const DriverRoutes = router;
