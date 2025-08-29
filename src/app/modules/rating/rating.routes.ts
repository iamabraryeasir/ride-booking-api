/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { RatingController } from './rating.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { 
    createRatingZodValidator, 
    updateRatingZodValidator 
} from './rating.validator';

/**
 * Rating Routes
 */
const router = Router();

router.get(
    '/',
    checkAuth(...Object.values(ROLE)),
    RatingController.getUserRatings
);

router.post(
    '/ride/:rideId',
    checkAuth(ROLE.RIDER, ROLE.DRIVER),
    validateRequest(createRatingZodValidator),
    RatingController.createRating
);

router.patch(
    '/:ratingId',
    checkAuth(ROLE.RIDER, ROLE.DRIVER),
    validateRequest(updateRatingZodValidator),
    RatingController.updateRating
);

router.delete(
    '/:ratingId',
    checkAuth(ROLE.RIDER, ROLE.DRIVER),
    RatingController.deleteRating
);

router.get(
    '/average/:userId',
    checkAuth(...Object.values(ROLE)),
    RatingController.getUserAverageRating
);

export const RatingRoutes = router;
