import { Document, Types } from 'mongoose';

export enum Role {
    ADMIN = 'ADMIN',
    RIDER = 'RIDER',
    DRIVER = 'DRIVER',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    picture?: string;
    phone?: string;
    isBlocked?: boolean;
    isDeleted?: boolean;
}
