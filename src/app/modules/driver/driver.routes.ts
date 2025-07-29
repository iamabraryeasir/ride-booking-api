/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { DriverController } from './driver.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { applyForDriverZodValidator } from './driver.validator';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { Role } from '../user/user.interface';

/**
 * Routes
 */
const router = Router();

router.post(
    '/apply',
    checkAuth(Role.USER),
    validateRequest(applyForDriverZodValidator),
    DriverController.applyForDriver
);

router.get(
    '/pending-drivers',
    checkAuth(Role.ADMIN),
    DriverController.getAllPendingDrivers
);

export const DriverRoutes = router;
