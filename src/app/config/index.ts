import 'dotenv/config';

interface EnvConfig {
    // System
    PORT: number;
    NODE_ENV: 'development' | 'production';

    // Admin Data
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;

    // Database
    MONGO_URI: string;

    // Frontend URL
    FRONTEND_URL: string;

    // Json Web Token (JWT)
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRE: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE: string;

    // bcrypt
    BCRYPT_SALT_ROUND: number;
}

const loadConfigVariable = (): EnvConfig => {
    const requiredEnvVariable: string[] = [
        'PORT',
        'NODE_ENV',
        'ADMIN_EMAIL',
        'ADMIN_PASSWORD',
        'MONGO_URI',
        'FRONTEND_URL',
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPIRE',
        'JWT_REFRESH_SECRET',
        'JWT_REFRESH_EXPIRE',
        'BCRYPT_SALT_ROUND',
    ];

    requiredEnvVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });

    return {
        // System
        PORT: Number(process.env.PORT),
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',

        // Admin Data
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,

        // Database
        MONGO_URI: process.env.MONGO_URI as string,

        // Frontend URL
        FRONTEND_URL: process.env.FRONTEND_URL as string,

        // Json Web Token (JWT)
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,

        // bcrypt
        BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
    };
};

const config: EnvConfig = loadConfigVariable();

export default config;
