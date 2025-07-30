/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { IUser, ROLE } from './user.interface';

/**
 * Schema
 */
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(ROLE),
            default: ROLE.RIDER,
        },
        picture: {
            type: String,
        },
        phone: {
            type: String,
            unique: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * Exporting Model
 */
export const User = model<IUser>('User', userSchema);
