import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { ReportController } from './report.controller';

const router = Router();

router.get('/', checkAuth(ROLE.ADMIN), ReportController.getAllReports);

router.get('/daily-analytics', checkAuth(ROLE.ADMIN), ReportController.getDailyAnalytics);

router.get('/monthly-analytics', checkAuth(ROLE.ADMIN), ReportController.getMonthlyAnalytics);

router.get('/driver-activity', checkAuth(ROLE.ADMIN), ReportController.getDriverActivityAnalytics);

router.get('/revenue-trends', checkAuth(ROLE.ADMIN), ReportController.getRevenueTrends);

export const ReportRoutes = router;
