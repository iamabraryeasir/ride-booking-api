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

/**
 * Routes
 */
const router = Router();

router.get('/', checkAuth(ROLE.ADMIN), RideController.getAllRides);

export const RideRoutes = router;
