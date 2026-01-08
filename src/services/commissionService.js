import commissionRepository from '../repositories/commissionRepository.js';
import { toViewModel, toCSVFormat } from '../dto/commissionDTO.js';
import { Parser } from 'json2csv';
import logger from '../utils/logger.js';

/**
 * Commission Service
 * Business logic for commission report generation
 */
class CommissionService {
  /**
   * Get commission report
   */
  async getCommissionReport(queryParams) {
    try {
      const filters = {
        salesmanId: queryParams.salesmanId ? parseInt(queryParams.salesmanId) : null,
        salesmanName: queryParams.salesman || null,
        carClass: queryParams.carClass || null,
        brand: queryParams.brand || null,
        sortBy: queryParams.sortBy || null,
        sortOrder: queryParams.sortOrder || 'desc'
      };

      const reportData = await commissionRepository.calculateCommissionReport(filters);
      
      return toViewModel(reportData);
    } catch (error) {
      logger.error(`CommissionService getCommissionReport error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export commission report as CSV
   */
  async exportCommissionReportCSV(queryParams) {
    try {
      const filters = {
        salesmanId: queryParams.salesmanId ? parseInt(queryParams.salesmanId) : null,
        salesmanName: queryParams.salesman || null,
        carClass: queryParams.carClass || null,
        brand: queryParams.brand || null,
        sortBy: queryParams.sortBy || null,
        sortOrder: queryParams.sortOrder || 'desc'
      };

      const reportData = await commissionRepository.calculateCommissionReport(filters);
      const csvData = toCSVFormat(reportData);

      const fields = [
        'Salesman Name',
        'Salesman Code',
        'Previous Year Sales',
        'Qualifies for Bonus',
        'Brand',
        'Car Class',
        'Units Sold',
        'Base Commission %',
        'Bonus %',
        'Total %',
        'Fixed Commission',
        'Percent Commission',
        'Total Commission'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(csvData);

      return csv;
    } catch (error) {
      logger.error(`CommissionService exportCommissionReportCSV error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all salesmen for filtering
   */
  async getAllSalesmen() {
    try {
      const salesmen = await commissionRepository.getAllSalesmen();
      return salesmen.map(s => ({
        id: s.id,
        name: s.name,
        code: s.code,
        previousYearSales: parseFloat(s.previous_year_sales)
      }));
    } catch (error) {
      logger.error(`CommissionService getAllSalesmen error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get commission rules
   */
  async getCommissionRules() {
    try {
      const rules = await commissionRepository.getCommissionRules();
      return rules.map(r => ({
        id: r.id,
        brand: r.brand,
        fixedCommission: parseFloat(r.fixed_commission),
        priceThreshold: parseFloat(r.price_threshold),
        classAPercent: parseFloat(r.class_a_percent),
        classBPercent: parseFloat(r.class_b_percent),
        classCPercent: parseFloat(r.class_c_percent)
      }));
    } catch (error) {
      logger.error(`CommissionService getCommissionRules error: ${error.message}`);
      throw error;
    }
  }
}

export default new CommissionService();



