/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IEmergencyContact } from './emergency.interface';
import { EmergencyContact } from './emergency.model';
import { User } from '../user/user.model';

/**
 * Get User Emergency Contacts
 */
const getUserEmergencyContacts = async (userId: string) => {
    const contacts = await EmergencyContact.find({ 
        user: userId, 
        isActive: true 
    }).sort({ isPrimary: -1, createdAt: -1 });

    return contacts;
};

/**
 * Create Emergency Contact
 */
const createEmergencyContact = async (userId: string, payload: Partial<IEmergencyContact>) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'User is blocked');
    }

    // Check if contact limit is reached (max 5 emergency contacts)
    const existingContactsCount = await EmergencyContact.countDocuments({
        user: userId,
        isActive: true,
    });

    if (existingContactsCount >= 5) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'Maximum 5 emergency contacts allowed'
        );
    }

    // If this is set as primary, unset other primary contacts
    if (payload.isPrimary) {
        await EmergencyContact.updateMany(
            { user: userId, isPrimary: true },
            { isPrimary: false }
        );
    }

    // If this is the first contact, make it primary
    if (existingContactsCount === 0) {
        payload.isPrimary = true;
    }

    const emergencyContact = await EmergencyContact.create({
        ...payload,
        user: userId,
    });

    return emergencyContact;
};

/**
 * Update Emergency Contact
 */
const updateEmergencyContact = async (userId: string, contactId: string, payload: Partial<IEmergencyContact>) => {
    const contact = await EmergencyContact.findById(contactId);
    if (!contact) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Emergency contact not found');
    }

    if (contact.user.toString() !== userId) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only update your own emergency contacts');
    }

    // If this is set as primary, unset other primary contacts
    if (payload.isPrimary) {
        await EmergencyContact.updateMany(
            { user: userId, isPrimary: true, _id: { $ne: contactId } },
            { isPrimary: false }
        );
    }

    Object.assign(contact, payload);
    await contact.save();

    return contact;
};

/**
 * Delete Emergency Contact
 */
const deleteEmergencyContact = async (userId: string, contactId: string) => {
    const contact = await EmergencyContact.findById(contactId);
    if (!contact) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Emergency contact not found');
    }

    if (contact.user.toString() !== userId) {
        throw new AppError(httpStatusCodes.FORBIDDEN, 'You can only delete your own emergency contacts');
    }

    // Soft delete by setting isActive to false
    contact.isActive = false;
    await contact.save();

    // If this was the primary contact, set another one as primary
    if (contact.isPrimary) {
        const nextContact = await EmergencyContact.findOne({
            user: userId,
            isActive: true,
            _id: { $ne: contactId }
        });
        
        if (nextContact) {
            nextContact.isPrimary = true;
            await nextContact.save();
        }
    }

    return { message: 'Emergency contact deleted successfully' };
};

export const EmergencyService = {
    getUserEmergencyContacts,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
};
