/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { EmergencyController } from './emergency.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { 
    createEmergencyContactZodValidator, 
    updateEmergencyContactZodValidator 
} from './emergency.validator';

/**
 * Emergency Contact Routes
 */
const router = Router();

router.get(
    '/',
    checkAuth(...Object.values(ROLE)),
    EmergencyController.getUserEmergencyContacts
);

router.post(
    '/',
    checkAuth(...Object.values(ROLE)),
    validateRequest(createEmergencyContactZodValidator),
    EmergencyController.createEmergencyContact
);

router.patch(
    '/:contactId',
    checkAuth(...Object.values(ROLE)),
    validateRequest(updateEmergencyContactZodValidator),
    EmergencyController.updateEmergencyContact
);

router.delete(
    '/:contactId',
    checkAuth(...Object.values(ROLE)),
    EmergencyController.deleteEmergencyContact
);

export const EmergencyRoutes = router;
