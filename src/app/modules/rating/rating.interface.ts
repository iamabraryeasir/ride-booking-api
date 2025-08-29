import { Types, Document } from 'mongoose';

export enum RATING_TYPE {
    RIDER_TO_DRIVER = 'RIDER_TO_DRIVER',
    DRIVER_TO_RIDER = 'DRIVER_TO_RIDER',
}

export interface IRating extends Document {
    ride: Types.ObjectId;
    rater: Types.ObjectId; // User who is giving the rating
    ratee: Types.ObjectId; // User who is receiving the rating
    ratingType: RATING_TYPE;
    rating: number; // 1-5 stars
    comment?: string;
    isActive: boolean;
}
