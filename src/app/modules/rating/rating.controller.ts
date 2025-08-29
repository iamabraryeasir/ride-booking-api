/**
 * Node Modules
 */
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RatingService } from './rating.service';

/**
 * Create Rating
 */
const createRating = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { rideId } = req.params;
    
    const rating = await RatingService.createRating(userId, rideId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: 'Rating created successfully',
        data: rating,
    });
});

/**
 * Get User Ratings
 */
const getUserRatings = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { type } = req.query;
    
    const ratings = await RatingService.getUserRatings(userId, type as 'received' | 'given');

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Ratings fetched successfully',
        data: ratings,
    });
});

/**
 * Update Rating
 */
const updateRating = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { ratingId } = req.params;
    
    const rating = await RatingService.updateRating(userId, ratingId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Rating updated successfully',
        data: rating,
    });
});

/**
 * Delete Rating
 */
const deleteRating = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { ratingId } = req.params;
    
    const result = await RatingService.deleteRating(userId, ratingId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: result.message,
        data: null,
    });
});

/**
 * Get User Average Rating
 */
const getUserAverageRating = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    const ratingStats = await RatingService.getUserAverageRating(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'User average rating fetched successfully',
        data: ratingStats,
    });
});

export const RatingController = {
    createRating,
    getUserRatings,
    updateRating,
    deleteRating,
    getUserAverageRating,
};
