/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IRating, RATING_TYPE } from './rating.interface';
import { Rating } from './rating.model';
import { Ride } from '../ride/ride.model';
import { Driver } from '../driver/driver.model';
import { RIDE_STATUS } from '../ride/ride.interface';

/**
 * Create Rating
 */
const createRating = async (userId: string, rideId: string, payload: Partial<IRating>) => {
    const ride = await Ride.findById(rideId)
        .populate('rider', '_id')
        .populate({
            path: 'driver',
            populate: {
                path: 'user',
                select: '_id'
            }
        });

    if (!ride) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Ride not found');
    }

    if (ride.status !== RIDE_STATUS.COMPLETED) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'Can only rate completed rides');
    }

    const isRider = (ride.rider as any)._id.toString() === userId;
    const isDriver = ride.driver && (ride.driver as any).user && (ride.driver as any).user._id.toString() === userId;

    if (!isRider && !isDriver) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only rate rides you participated in');
    }

    let ratingType: RATING_TYPE;
    let rateeId: string;

    if (isRider) {
        ratingType = RATING_TYPE.RIDER_TO_DRIVER;
        rateeId = (ride.driver as any).user._id.toString();
    } else {
        ratingType = RATING_TYPE.DRIVER_TO_RIDER;
        rateeId = (ride.rider as any)._id.toString();
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
        ride: rideId,
        ratingType: ratingType,
    });

    if (existingRating) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'Rating already exists for this ride');
    }

    const rating = await Rating.create({
        ride: rideId,
        rater: userId,
        ratee: rateeId,
        ratingType: ratingType,
        rating: payload.rating,
        comment: payload.comment,
    });

    await rating.populate('rater', 'name');
    await rating.populate('ratee', 'name');
    return rating;
};

/**
 * Get User Ratings
 */
const getUserRatings = async (userId: string, type: 'received' | 'given' = 'received') => {
    const query = type === 'received' ? { ratee: userId } : { rater: userId };
    
    const ratings = await Rating.find({ ...query, isActive: true })
        .populate('rater', 'name picture')
        .populate('ratee', 'name picture')
        .populate('ride', 'pickupAddress destinationAddress price')
        .sort({ createdAt: -1 });

    return ratings;
};

/**
 * Update Rating
 */
const updateRating = async (userId: string, ratingId: string, payload: Partial<IRating>) => {
    const rating = await Rating.findById(ratingId);
    if (!rating) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Rating not found');
    }

    if (rating.rater.toString() !== userId) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only update your own ratings');
    }

    Object.assign(rating, payload);
    await rating.save();

    await rating.populate('rater', 'name');
    await rating.populate('ratee', 'name');
    return rating;
};

/**
 * Delete Rating
 */
const deleteRating = async (userId: string, ratingId: string) => {
    const rating = await Rating.findById(ratingId);
    if (!rating) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Rating not found');
    }

    if (rating.rater.toString() !== userId) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only delete your own ratings');
    }

    rating.isActive = false;
    await rating.save();

    return { message: 'Rating deleted successfully' };
};

/**
 * Get User Average Rating
 */
const getUserAverageRating = async (userId: string) => {
    const { Types } = require('mongoose');
    const ratingStats = await Rating.aggregate([
        {
            $match: {
                ratee: new Types.ObjectId(userId),
                isActive: true,
            },
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 },
                ratingDistribution: {
                    $push: '$rating',
                },
            },
        },
        {
            $project: {
                averageRating: { $round: ['$averageRating', 1] },
                totalRatings: 1,
                ratingDistribution: 1,
            },
        },
    ]);

    return ratingStats[0] || { averageRating: 0, totalRatings: 0, ratingDistribution: [] };
};

export const RatingService = {
    createRating,
    getUserRatings,
    updateRating,
    deleteRating,
    getUserAverageRating,
};
