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

export const UserServices = { registerUser };
