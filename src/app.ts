/**
 * Node Modules
 */
import cookieParser from 'cookie-parser';
import httpStatusCodes from 'http-status-codes';
import express, { Request, Response } from 'express';
import cors from 'cors';

/**
 * Local Modules
 */
import config from './app/config';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.middleware';
import { routeNotFound } from './app/middlewares/routeNotFound.middleware';

const app = express();

/**
 * CORS Setup
 */
app.set('trust proxy', 1);
app.use(
    cors({
        origin: config.FRONTEND_URL,
        credentials: true,
    })
);

/**
 * Basic Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Home Route
 */
app.get('/', (req: Request, res: Response) => {
    res.status(httpStatusCodes.OK).json({
        success: true,
        message: 'Welcome to Abrar Ride Booking System API',
    });
});

/**
 * Global Error Handler
 */
app.use(globalErrorHandler);

/**
 * Not Found Route
 */
app.use(routeNotFound);

export default app;
