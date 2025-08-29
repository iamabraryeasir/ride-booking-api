/**
 * Node Modules
 */
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { EmergencyService } from './emergency.service';

/**
 * Get User Emergency Contacts
 */
const getUserEmergencyContacts = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const contacts = await EmergencyService.getUserEmergencyContacts(userId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Emergency contacts fetched successfully',
        data: contacts,
    });
});

/**
 * Create Emergency Contact
 */
const createEmergencyContact = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const contact = await EmergencyService.createEmergencyContact(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.CREATED,
        message: 'Emergency contact created successfully',
        data: contact,
    });
});

/**
 * Update Emergency Contact
 */
const updateEmergencyContact = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { contactId } = req.params;
    
    const contact = await EmergencyService.updateEmergencyContact(userId, contactId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Emergency contact updated successfully',
        data: contact,
    });
});

/**
 * Delete Emergency Contact
 */
const deleteEmergencyContact = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { contactId } = req.params;
    
    const result = await EmergencyService.deleteEmergencyContact(userId, contactId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: result.message,
        data: null,
    });
});

export const EmergencyController = {
    getUserEmergencyContacts,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
};
