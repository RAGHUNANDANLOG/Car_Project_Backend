import { Router } from 'express';
import commissionController from '../controllers/commissionController.js';
import { commissionValidators } from '../middleware/validators.js';

const router = Router();

/**
 * Commission Routes
 * All routes are prefixed with /api/commission
 */

// GET /api/commission/report - Get commission report
router.get('/report', 
  commissionValidators.getReport, 
  commissionController.getReport.bind(commissionController)
);

// GET /api/commission/export - Export commission report as CSV
router.get('/export', 
  commissionValidators.getReport, 
  commissionController.exportCSV.bind(commissionController)
);

// GET /api/commission/salesmen - Get all salesmen for filtering
router.get('/salesmen', 
  commissionController.getSalesmen.bind(commissionController)
);

// GET /api/commission/rules - Get commission rules
router.get('/rules', 
  commissionController.getRules.bind(commissionController)
);

export default router;



