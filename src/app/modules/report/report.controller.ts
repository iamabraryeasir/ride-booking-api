import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ReportService } from './report.service';

const getAllReports = catchAsync(async (req: Request, res: Response) => {
    const { from, to } = req.query;

    const toDate = to ? new Date(to as string) : new Date();
    const fromDate = from
        ? new Date(from as string)
        : new Date(new Date().setMonth(toDate.getMonth() - 1));

    const reports = await ReportService.getAllReports(fromDate, toDate);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Reports fetched successfully',
        data: reports,
        meta: {
            from: fromDate,
            to: toDate,
        },
    });
});

/**
 * Get Daily Analytics
 */
const getDailyAnalytics = catchAsync(async (req: Request, res: Response) => {
    const { days } = req.query;
    const daysCount = days ? parseInt(days as string) : 7;
    
    const analytics = await ReportService.getDailyAnalytics(daysCount);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Daily analytics fetched successfully',
        data: analytics,
    });
});

/**
 * Get Monthly Analytics
 */
const getMonthlyAnalytics = catchAsync(async (req: Request, res: Response) => {
    const { months } = req.query;
    const monthsCount = months ? parseInt(months as string) : 6;
    
    const analytics = await ReportService.getMonthlyAnalytics(monthsCount);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Monthly analytics fetched successfully',
        data: analytics,
    });
});

/**
 * Get Driver Activity Analytics
 */
const getDriverActivityAnalytics = catchAsync(async (req: Request, res: Response) => {
    const analytics = await ReportService.getDriverActivityAnalytics();

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Driver activity analytics fetched successfully',
        data: analytics,
    });
});

/**
 * Get Revenue Trends
 */
const getRevenueTrends = catchAsync(async (req: Request, res: Response) => {
    const trends = await ReportService.getRevenueTrends();

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Revenue trends fetched successfully',
        data: trends,
    });
});

export const ReportController = {
    getAllReports,
    getDailyAnalytics,
    getMonthlyAnalytics,
    getDriverActivityAnalytics,
    getRevenueTrends,
};
