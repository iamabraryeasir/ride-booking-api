/**
 * Node Module
 */
import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserServices } from './user.service';

/**
 * Register New User
 */
const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log('Register user called');
        const user = await UserServices.registerUser(req.body);
        console.log('User registered:', user);
        
        sendResponse(res, {
            statusCode: httpStatusCodes.CREATED,
            message: 'User created successful',
            data: {
                name: user.name,
                email: user.email,
            },
        });
    }
);

export const UserController = {
    registerUser,
};
