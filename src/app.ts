/**
 * Node Modules
 */
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

/**
 * Local Modules
 */
import config from './app/config';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.middleware';
import { routeNotFound } from './app/middlewares/routeNotFound.middleware';
import { AppRouter } from './app/routes';

const app = express();

// CORS configuration
app.use(
    cors({
        origin: config.FRONTEND_URL,
        credentials: true,
    })
);

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
 * Main Routes
 */
app.use('/api/v1', AppRouter);

/**
 * Global Error Handler
 */
app.use(globalErrorHandler);

/**
 * Not Found Route
 */
app.use(routeNotFound);

export default app;
