import commissionService from '../services/commissionService.js';
import { successResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

/**
 * Commission Controller
 * Handles HTTP requests for commission report operations
 */
class CommissionController {
  /**
   * Get commission report
   * GET /api/commission/report
   */
  async getReport(req, res, next) {
    try {
      const report = await commissionService.getCommissionReport(req.query);
      
      return successResponse(res, report, 'Commission report generated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export commission report as CSV
   * GET /api/commission/export
   */
  async exportCSV(req, res, next) {
    try {
      const csv = await commissionService.exportCommissionReportCSV(req.query);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=commission_report.csv');
      
      return res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all salesmen for filtering
   * GET /api/commission/salesmen
   */
  async getSalesmen(req, res, next) {
    try {
      const salesmen = await commissionService.getAllSalesmen();
      
      return successResponse(res, salesmen, 'Salesmen retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get commission rules
   * GET /api/commission/rules
   */
  async getRules(req, res, next) {
    try {
      const rules = await commissionService.getCommissionRules();
      
      return successResponse(res, rules, 'Commission rules retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CommissionController();



