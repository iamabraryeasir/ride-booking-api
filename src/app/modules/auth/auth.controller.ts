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

export const AuthController = { loginUser, logoutUser };
