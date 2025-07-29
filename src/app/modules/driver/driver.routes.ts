/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { DriverController } from './driver.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import {
    applyForDriverZodValidator,
    rejectedDriverApplicationZodValidator,
} from './driver.validator';
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

router.get('/', checkAuth(Role.ADMIN), DriverController.getAllDrivers);

router.patch(
    '/approve-driver/:applicationId',
    checkAuth(Role.ADMIN),
    DriverController.approveDriverApplication
);

router.patch(
    '/reject-driver/:applicationId',
    checkAuth(Role.ADMIN),
    validateRequest(rejectedDriverApplicationZodValidator),
    DriverController.rejectDriverApplication
);

export const DriverRoutes = router;
