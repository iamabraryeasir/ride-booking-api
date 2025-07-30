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

/**
 * Driver Routes
 */
const router = Router();

router.get('/', checkAuth(ROLE.ADMIN), DriverController.getAllDrivers);

export const DriverRoutes = router;
