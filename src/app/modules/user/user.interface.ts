import { Document } from 'mongoose';

export enum ROLE {
    ADMIN = 'ADMIN',
    RIDER = 'RIDER',
    DRIVER = 'DRIVER',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: ROLE;
    picture?: string;
    phone?: string;
    isBlocked?: boolean;
    isDeleted?: boolean;
}
