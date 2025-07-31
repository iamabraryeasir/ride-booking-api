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

export const ReportController = {
    getAllReports,
};
