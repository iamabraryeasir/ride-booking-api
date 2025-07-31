/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { AuthController } from './auth.controller';

/**
 * Routes
 */
const router = Router();

router.post('/login', AuthController.loginUser);

router.post('/logout', AuthController.logoutUser);

router.post('/refresh-token', AuthController.getNewAccessToken);

export const AuthRoutes = router;
