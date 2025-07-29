/**
 * Node Modules
 */
import { Router } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { DriverRoutes } from '../modules/driver/driver.routes';

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
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/drivers',
        route: DriverRoutes,
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
