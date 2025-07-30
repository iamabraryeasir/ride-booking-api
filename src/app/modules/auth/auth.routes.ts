/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { AuthController } from './auth.controller';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';

/**
 * Routes
 */
const router = Router();

router.post('/login', AuthController.loginUser);

router.post('/logout', AuthController.logoutUser);

router.post('/refresh-token', AuthController.getNewAccessToken);

export const AuthRoutes = router;
