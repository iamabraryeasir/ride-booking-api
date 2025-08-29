/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { SettingsController } from './settings.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { updateSettingsZodValidator } from './settings.validator';

/**
 * Settings Routes
 */
const router = Router();

router.get(
    '/',
    checkAuth(...Object.values(ROLE)),
    SettingsController.getUserSettings
);

router.patch(
    '/',
    checkAuth(...Object.values(ROLE)),
    validateRequest(updateSettingsZodValidator),
    SettingsController.updateUserSettings
);

router.post(
    '/reset',
    checkAuth(...Object.values(ROLE)),
    SettingsController.resetUserSettings
);

export const SettingsRoutes = router;
