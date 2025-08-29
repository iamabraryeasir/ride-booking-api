/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';
import bcrypt from 'bcryptjs';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import config from '../../config';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { userSearchableFields } from './user.constant';

/**
 * Register New User
 */
const registerUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(
        password as string,
        config.BCRYPT_SALT_ROUND
    );

    const newUser = await User.create({
        email,
        password: hashedPassword,
        ...rest,
    });

    return newUser;
};

/**
 * Toggle User Block
 */
const toggleUserBlock = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return user;
};

/**
 * Get All Users
 */
const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields('-isDeleted -password')
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);

    return {
        data,
        meta,
    };
};

/**
 * Get User Profile
 */
const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-password -isDeleted');
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    return user;
};

/**
 * Update User Profile
 */
const updateUserProfile = async (userId: string, payload: Partial<IUser>) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'User is blocked');
    }

    // Check if phone number is being updated and if it's already taken by another user
    if (payload.phone) {
        const phoneExists = await User.findOne({ 
            phone: payload.phone, 
            _id: { $ne: userId } 
        });
        if (phoneExists) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, 'Phone number is already in use');
        }
    }

    Object.assign(user, payload);
    await user.save();

    return user.toObject({ transform: (doc: any, ret: any) => {
        delete ret.password;
        delete ret.isDeleted;
        return ret;
    }});
};

/**
 * Change User Password
 */
const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'User is blocked');
    }

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, config.BCRYPT_SALT_ROUND);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password changed successfully' };
};

export const UserServices = { 
    registerUser, 
    toggleUserBlock, 
    getAllUsers, 
    getUserProfile, 
    updateUserProfile, 
    changePassword 
};
