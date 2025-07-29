/**
 * Node Modules
 */
import { Router } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { UserRoutes } from '../modules/users/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';

/**
 * Types
 */
interface IModuleRoutes {
    path: string;
    route: Router;
}

const router = Router();

/**
 * Routes List
 */
const moduleRoutes: IModuleRoutes[] = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
];

/**
 * Home Route
 */
router.get('/', (req, res) => {
    res.status(httpStatusCodes.OK).json({
        success: true,
        message: 'Welcome to Abrar Ride Booking System API V1',
    });
});

/**
 * Register Routes
 */
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export const AppRouter = router;
