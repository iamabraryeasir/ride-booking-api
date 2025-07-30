/**
 * Node Modules
 */
import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { registerUserZodSchema } from './user.validation';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from './user.interface';

/**
 * All Routes
 */
const router = Router();

router.post(
    '/register',
    validateRequest(registerUserZodSchema),
    UserController.registerUser
);

router.patch(
    '/toggle-block/:userId',
    checkAuth(ROLE.ADMIN),
    UserController.toggleUserBlock
);

export const UserRoutes = router;
