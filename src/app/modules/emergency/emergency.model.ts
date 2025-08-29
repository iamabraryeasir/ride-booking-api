/**
 * Node Modules
 */
import { model, Schema } from 'mongoose';

/**
 * Local Modules
 */
import { IEmergencyContact, CONTACT_RELATIONSHIP } from './emergency.interface';

/**
 * Emergency Contact Schema
 */
const emergencyContactSchema = new Schema<IEmergencyContact>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        relationship: {
            type: String,
            enum: Object.values(CONTACT_RELATIONSHIP),
            required: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * Indexes
 */
emergencyContactSchema.index({ user: 1, isPrimary: 1 });

export const EmergencyContact = model<IEmergencyContact>('EmergencyContact', emergencyContactSchema);
