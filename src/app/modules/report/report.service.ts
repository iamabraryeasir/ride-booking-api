import { Driver } from '../driver/driver.model';
import { Ride } from '../ride/ride.model';
import { User } from '../user/user.model';

const getAllReports = async (fromDate: Date, toDate: Date) => {
    const totalUsersPromise = User.countDocuments({
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const totalRidersPromise = User.countDocuments({
        role: 'rider',
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const totalDriversPromise = User.countDocuments({
        role: 'driver',
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const blockedUsersPromise = User.countDocuments({
        isBlocked: true,
        createdAt: { $gte: fromDate, $lte: toDate },
    });

    const totalRidesPromise = Ride.countDocuments({
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const completedRidesPromise = Ride.countDocuments({
        status: 'COMPLETED',
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const cancelledRidesPromise = Ride.countDocuments({
        status: 'CANCELLED',
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const activeRidesPromise = Ride.countDocuments({
        status: { $in: ['REQUESTED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'] },
        createdAt: { $gte: fromDate, $lte: toDate },
    });

    const approvedDriversPromise = Driver.countDocuments({
        applicationStatus: 'approved',
        createdAt: { $gte: fromDate, $lte: toDate },
    });
    const pendingDriversPromise = Driver.countDocuments({
        applicationStatus: 'pending',
        createdAt: { $gte: fromDate, $lte: toDate },
    });

    const earningsDataPromise = Ride.aggregate([
        {
            $match: {
                status: 'COMPLETED',
                createdAt: { $gte: fromDate, $lte: toDate },
            },
        },
        { $group: { _id: null, totalEarnings: { $sum: '$price' } } },
    ]);

    const [
        totalUsers,
        totalRiders,
        totalDrivers,
        blockedUsers,
        totalRides,
        completedRides,
        cancelledRides,
        activeRides,
        approvedDrivers,
        pendingDrivers,
        earningsData,
    ] = await Promise.all([
        totalUsersPromise,
        totalRidersPromise,
        totalDriversPromise,
        blockedUsersPromise,
        totalRidesPromise,
        completedRidesPromise,
        cancelledRidesPromise,
        activeRidesPromise,
        approvedDriversPromise,
        pendingDriversPromise,
        earningsDataPromise,
    ]);

    const totalEarnings = earningsData[0]?.totalEarnings || 0;

    return {
        users: {
            total: totalUsers,
            riders: totalRiders,
            drivers: totalDrivers,
            blocked: blockedUsers,
            approvedDrivers,
            pendingDrivers,
        },
        rides: {
            total: totalRides,
            completed: completedRides,
            cancelled: cancelledRides,
            active: activeRides,
        },
        earnings: {
            total: totalEarnings,
        },
    };
};

/**
 * Get Daily Analytics
 */
const getDailyAnalytics = async (days: number = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyData = await Ride.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' },
                },
                totalRides: { $sum: 1 },
                completedRides: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
                },
                cancelledRides: {
                    $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
                },
                totalRevenue: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$price', 0] },
                },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
        },
    ]);

    return dailyData;
};

/**
 * Get Monthly Analytics
 */
const getMonthlyAnalytics = async (months: number = 6) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const monthlyData = await Ride.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                totalRides: { $sum: 1 },
                completedRides: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
                },
                totalRevenue: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$price', 0] },
                },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 },
        },
    ]);

    return monthlyData;
};

/**
 * Get Driver Activity Analytics
 */
const getDriverActivityAnalytics = async () => {
    const driverStats = await Driver.aggregate([
        {
            $lookup: {
                from: 'rides',
                localField: '_id',
                foreignField: 'driver',
                as: 'rides',
            },
        },
        {
            $project: {
                _id: 1,
                user: 1,
                isOnline: 1,
                isSuspended: 1,
                applicationStatus: 1,
                totalRides: { $size: '$rides' },
                completedRides: {
                    $size: {
                        $filter: {
                            input: '$rides',
                            cond: { $eq: ['$$this.status', 'COMPLETED'] },
                        },
                    },
                },
                earnings: {
                    $sum: {
                        $map: {
                            input: {
                                $filter: {
                                    input: '$rides',
                                    cond: { $eq: ['$$this.status', 'COMPLETED'] },
                                },
                            },
                            as: 'ride',
                            in: '$$ride.price',
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            },
        },
        {
            $project: {
                _id: 1,
                name: { $first: '$userInfo.name' },
                email: { $first: '$userInfo.email' },
                isOnline: 1,
                isSuspended: 1,
                applicationStatus: 1,
                totalRides: 1,
                completedRides: 1,
                earnings: 1,
            },
        },
        {
            $sort: { earnings: -1 },
        },
    ]);

    return driverStats;
};

/**
 * Get Revenue Trends
 */
const getRevenueTrends = async () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const revenueTrends = await Ride.aggregate([
        {
            $match: {
                status: 'COMPLETED',
                'timestamps.completedAt': { $gte: last30Days },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$timestamps.completedAt' },
                    month: { $month: '$timestamps.completedAt' },
                    day: { $dayOfMonth: '$timestamps.completedAt' },
                },
                dailyRevenue: { $sum: '$price' },
                rideCount: { $sum: 1 },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
        },
        {
            $project: {
                date: {
                    $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: '$_id.day',
                    },
                },
                dailyRevenue: 1,
                rideCount: 1,
            },
        },
    ]);

    return revenueTrends;
};

export const ReportService = {
    getAllReports,
    getDailyAnalytics,
    getMonthlyAnalytics,
    getDriverActivityAnalytics,
    getRevenueTrends,
};
