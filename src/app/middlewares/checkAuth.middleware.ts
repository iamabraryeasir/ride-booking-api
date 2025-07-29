/**
 * Node Modules
 */
import { JwtPayload } from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import config from '../config';
import { verifyJwtToken } from '../utils/jwt';
import { AppError } from '../errorHelpers/AppError';
import { Role } from '../modules/users/user.interface';
import { User } from '../modules/users/user.model';

/**
 * Main Middleware Logic
 */
export const checkAuth =
    (...authRoles: Role[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                throw new AppError(403, 'No token received');
            }

            const verifiedToken = verifyJwtToken(
                accessToken,
                config.JWT_ACCESS_SECRET
            ) as JwtPayload;

            const isUserExists = await User.findOne({
                email: verifiedToken.email,
            });

            if (!isUserExists) {
                throw new AppError(
                    httpStatusCodes.BAD_REQUEST,
                    'User does not exist'
                );
            }

            if (isUserExists.isDeleted) {
                throw new AppError(
                    httpStatusCodes.BAD_REQUEST,
                    'User is deleted'
                );
            }

            if (isUserExists.isBlocked) {
                throw new AppError(
                    httpStatusCodes.BAD_REQUEST,
                    'User is Blocked'
                );
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(
                    401,
                    'You are not permitted to view the route'
                );
            }

            req.user = verifiedToken;

            next();
        } catch (error) {
            next(error);
        }
    };
