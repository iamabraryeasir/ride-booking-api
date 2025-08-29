/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { PaymentController } from './payment.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { 
    createPaymentMethodZodValidator, 
    updatePaymentMethodZodValidator 
} from './payment.validator';

/**
 * Payment Routes
 */
const router = Router();

router.get(
    '/',
    checkAuth(ROLE.RIDER),
    PaymentController.getUserPaymentMethods
);

router.post(
    '/',
    checkAuth(ROLE.RIDER),
    validateRequest(createPaymentMethodZodValidator),
    PaymentController.createPaymentMethod
);

router.patch(
    '/:paymentMethodId',
    checkAuth(ROLE.RIDER),
    validateRequest(updatePaymentMethodZodValidator),
    PaymentController.updatePaymentMethod
);

router.delete(
    '/:paymentMethodId',
    checkAuth(ROLE.RIDER),
    PaymentController.deletePaymentMethod
);

export const PaymentRoutes = router;
