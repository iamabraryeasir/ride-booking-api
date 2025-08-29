/**
 * Node Modules
 */
import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { registerUserZodSchema, updateProfileZodSchema, changePasswordZodSchema } from './user.validation';
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

router.get('/', checkAuth(ROLE.ADMIN), UserController.getAllUsers);

// Profile management routes
router.get(
    '/profile',
    checkAuth(...Object.values(ROLE)),
    UserController.getUserProfile
);

router.patch(
    '/profile',
    checkAuth(...Object.values(ROLE)),
    validateRequest(updateProfileZodSchema),
    UserController.updateUserProfile
);

router.patch(
    '/change-password',
    checkAuth(...Object.values(ROLE)),
    validateRequest(changePasswordZodSchema),
    UserController.changePassword
);

export const UserRoutes = router;
