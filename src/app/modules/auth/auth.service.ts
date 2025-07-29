import httpStatusCodes from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { AppError } from '../../errorHelpers/AppError';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import {
    createNewAccessTokenWithRefreshToken,
    createUserTokens,
} from '../../utils/userTokens';

/**
 * Login User
 */
const loginUser = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'Email does not exist');
    }

    const isPasswordMatched = await bcrypt.compare(
        password as string,
        isUserExist.password as string
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'Incorrect Password');
    }

    const userTokens = createUserTokens(isUserExist);

    const {
        password: pass,
        isDeleted,
        isBlocked,
        ...rest
    } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
};

/**
 * Get new access token from refresh token
 */
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(
        refreshToken
    );

    return { accessToken: newAccessToken };
};

export const AuthServices = {
    loginUser,
    getNewAccessToken,
};
