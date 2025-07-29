/**
 * Node Modules
 */
import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { registerUserZodSchema } from './user.validation';

/**
 * All Routes
 */
const router = Router();

router.post(
    '/register',
    validateRequest(registerUserZodSchema),
    UserController.registerUser
);

export const UserRoutes = router;
