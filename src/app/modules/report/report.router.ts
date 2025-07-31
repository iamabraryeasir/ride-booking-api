import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { ROLE } from '../user/user.interface';
import { ReportController } from './report.controller';

const router = Router();

router.get('/', checkAuth(ROLE.ADMIN), ReportController.getAllReports);

export const ReportRoutes = router;
