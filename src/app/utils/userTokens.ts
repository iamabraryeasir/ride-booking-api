/**
 * Node Modules
 */
import { JwtPayload } from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import config from '../config';
import { User } from '../modules/users/user.model';
import { AppError } from '../errorHelpers/AppError';
import { generateJwtToken, verifyJwtToken } from './jwt';
import { IUser } from '../modules/users/user.interface';

/**
 * Function for creating access and refresh token in the login
 */
export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    // generate access token
    const accessToken = generateJwtToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET,
        config.JWT_ACCESS_EXPIRE
    );

    // generate refresh token
    const refreshToken = generateJwtToken(
        jwtPayload,
        config.JWT_REFRESH_SECRET,
        config.JWT_REFRESH_EXPIRE
    );

    return { accessToken, refreshToken };
};

/**
 * Function for generating new access token from refresh token
 */
export const createNewAccessTokenWithRefreshToken = async (
    refreshToken: string
) => {
    const verifiedRefreshToken = verifyJwtToken(
        refreshToken,
        config.JWT_REFRESH_SECRET
    ) as JwtPayload;

    const isUserExists = await User.findOne({
        email: verifiedRefreshToken.email,
    });

    if (!isUserExists) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User does not exist');
    }

    if (isUserExists.isBlocked) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, `User is Blocked`);
    }

    if (isUserExists.isDeleted) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User is deleted');
    }

    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role,
    };

    const accessToken = generateJwtToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET,
        config.JWT_ACCESS_EXPIRE
    );
    return accessToken;
};
