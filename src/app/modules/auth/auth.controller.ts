/**
 * Node Modules
 */
import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { setAuthCookie } from '../../utils/setCookie';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { AppError } from '../../errorHelpers/AppError';

/**
 * Login User
 */
const loginUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const loginInfo = await AuthServices.loginUser(req.body);

        setAuthCookie(res, {
            accessToken: loginInfo.accessToken,
            refreshToken: loginInfo.refreshToken,
        });

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'User logged in successfully',
            data: {
                accessToken: loginInfo.accessToken,
                refreshToken: loginInfo.refreshToken,
                user: loginInfo.user,
            },
        });
    }
);

/**
 * Logout User
 */
const logoutUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'User logout successful',
            data: null,
        });
    }
);

/**
 * Get New Access Token
 */
const getNewAccessToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError(
                httpStatusCodes.BAD_REQUEST,
                'No refresh token received from cookies'
            );
        }

        const { accessToken } = await AuthServices.getNewAccessToken(
            refreshToken
        );

        setAuthCookie(res, { accessToken });

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Successfully fetched the new access token',
            data: {
                accessToken,
            },
        });
    }
);

export const AuthController = { loginUser, logoutUser, getNewAccessToken };
