export enum Role {
    ADMIN = 'ADMIN',
    RIDER = 'RIDER',
    USER = 'USER',
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: Role;
    picture?: string;
    phone?: string;
    isBlocked?: boolean;
    isDeleted?: boolean;
}
