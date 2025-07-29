/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { IUser, Role } from './user.interface';

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
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER,
        },
        phone: {
            type: String,
        },
        picture: {
            type: String,
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
