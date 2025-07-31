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

export const ReportService = {
    getAllReports,
};
