/**
 * Node Module
 */
import { Request, Response } from 'express';
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
const registerUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServices.registerUser(req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: 'User created successful',
        data: {
            name: user.name,
            email: user.email,
        },
    });
});

/**
 * Toggle User Block
 */
const toggleUserBlock = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await UserServices.toggleUserBlock(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: `User is ${user.isBlocked ? 'Blocked' : 'Unblocked'}`,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

/**
 * Get All Users
 */
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await UserServices.getAllUsers(
        query as Record<string, string>
    );

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Users retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

export const UserController = {
    registerUser,
    toggleUserBlock,
    getAllUsers,
};
