/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { IRating, RATING_TYPE } from './rating.interface';

/**
 * Rating Schema
 */
const ratingSchema = new Schema<IRating>(
    {
        ride: {
            type: Schema.Types.ObjectId,
            ref: 'Ride',
            required: true,
        },
        rater: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ratee: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ratingType: {
            type: String,
            enum: Object.values(RATING_TYPE),
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * Indexes
 */
ratingSchema.index({ ride: 1, ratingType: 1 }, { unique: true });
ratingSchema.index({ ratee: 1 });

export const Rating = model<IRating>('Rating', ratingSchema);
