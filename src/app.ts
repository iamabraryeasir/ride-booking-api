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

export default app;
