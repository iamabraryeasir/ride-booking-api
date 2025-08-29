import { Types, Document } from 'mongoose';

export enum CONTACT_RELATIONSHIP {
    FAMILY = 'FAMILY',
    FRIEND = 'FRIEND',
    SPOUSE = 'SPOUSE',
    PARENT = 'PARENT',
    SIBLING = 'SIBLING',
    OTHER = 'OTHER',
}

export interface IEmergencyContact extends Document {
    user: Types.ObjectId;
    name: string;
    phone: string;
    relationship: CONTACT_RELATIONSHIP;
    isPrimary: boolean;
    isActive: boolean;
}
