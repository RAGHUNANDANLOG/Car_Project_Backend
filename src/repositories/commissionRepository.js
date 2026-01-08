import BaseRepository from './baseRepository.js';
import db from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Commission Repository
 * Handles sales data and commission calculations
 */
class CommissionRepository extends BaseRepository {
  constructor() {
    super('sales_data');
  }

  /**
   * Get all salesmen
   */
  async getAllSalesmen() {
    try {
      return await db('salesmen').orderBy('name');
    } catch (error) {
      logger.error(`CommissionRepository getAllSalesmen error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all commission rules
   */
  async getCommissionRules() {
    try {
      return await db('commission_rules').orderBy('brand');
    } catch (error) {
      logger.error(`CommissionRepository getCommissionRules error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get sales data with salesman info
   */
  async getSalesDataWithSalesmen(filters = {}) {
    try {
      let query = db('sales_data as sd')
        .join('salesmen as s', 'sd.salesman_id', 's.id')
        .select(
          's.id as salesman_id',
          's.name as salesman_name',
          's.code as salesman_code',
          's.previous_year_sales',
          'sd.car_class',
          'sd.audi_count',
          'sd.jaguar_count',
          'sd.land_rover_count',
          'sd.renault_count'
        );

      if (filters.salesmanId) {
        query = query.where('s.id', filters.salesmanId);
      }

      if (filters.salesmanName) {
        query = query.whereILike('s.name', `%${filters.salesmanName}%`);
      }

      if (filters.carClass) {
        query = query.where('sd.car_class', filters.carClass);
      }

      return await query.orderBy(['s.name', 'sd.car_class']);
    } catch (error) {
      logger.error(`CommissionRepository getSalesDataWithSalesmen error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate commission report with all rules applied
   */
  async calculateCommissionReport(filters = {}) {
    try {
      // Get commission rules
      const rules = await this.getCommissionRules();
      const rulesMap = {};
      rules.forEach(rule => {
        rulesMap[rule.brand] = rule;
      });

      // Get sales data
      const salesData = await this.getSalesDataWithSalesmen(filters);

      // Calculate commissions
      const reportData = [];

      // Group by salesman
      const salesmanGroups = {};
      salesData.forEach(sale => {
        if (!salesmanGroups[sale.salesman_id]) {
          salesmanGroups[sale.salesman_id] = {
            salesman_id: sale.salesman_id,
            salesman_name: sale.salesman_name,
            salesman_code: sale.salesman_code,
            previous_year_sales: parseFloat(sale.previous_year_sales),
            qualifies_for_bonus: parseFloat(sale.previous_year_sales) > 500000,
            sales: []
          };
        }
        salesmanGroups[sale.salesman_id].sales.push(sale);
      });

      // Calculate for each salesman
      Object.values(salesmanGroups).forEach(salesmanData => {
        const salesmanReport = {
          salesman_id: salesmanData.salesman_id,
          salesman_name: salesmanData.salesman_name,
          salesman_code: salesmanData.salesman_code,
          previous_year_sales: salesmanData.previous_year_sales,
          qualifies_for_bonus: salesmanData.qualifies_for_bonus,
          commissions: [],
          total_commission: 0
        };

        const brands = ['Audi', 'Jaguar', 'Land Rover', 'Renault'];
        const brandColumns = ['audi_count', 'jaguar_count', 'land_rover_count', 'renault_count'];

        salesmanData.sales.forEach(sale => {
          brands.forEach((brand, brandIndex) => {
            const count = sale[brandColumns[brandIndex]];
            if (count > 0) {
              const rule = rulesMap[brand];
              let classPercent;
              let bonusPercent = 0;

              switch (sale.car_class) {
                case 'A-Class':
                  classPercent = parseFloat(rule.class_a_percent);
                  // Add 2% bonus for Class A if previous year sales > $500,000
                  if (salesmanData.qualifies_for_bonus) {
                    bonusPercent = 2;
                  }
                  break;
                case 'B-Class':
                  classPercent = parseFloat(rule.class_b_percent);
                  break;
                case 'C-Class':
                  classPercent = parseFloat(rule.class_c_percent);
                  break;
                default:
                  classPercent = 0;
              }

              // Calculate commission
              // Assuming base price equals threshold for calculation
              const basePrice = parseFloat(rule.price_threshold);
              const percentCommission = (basePrice * (classPercent + bonusPercent) / 100) * count;
              
              // Fixed commission applies if price > threshold
              const fixedCommission = parseFloat(rule.fixed_commission) * count;

              const totalForThisItem = percentCommission + fixedCommission;

              salesmanReport.commissions.push({
                brand,
                car_class: sale.car_class,
                units_sold: count,
                base_percent: classPercent,
                bonus_percent: bonusPercent,
                total_percent: classPercent + bonusPercent,
                fixed_commission: fixedCommission,
                percent_commission: percentCommission,
                total_commission: totalForThisItem
              });

              salesmanReport.total_commission += totalForThisItem;
            }
          });
        });

        reportData.push(salesmanReport);
      });

      // Apply sorting
      if (filters.sortBy) {
        const sortOrder = filters.sortOrder?.toLowerCase() === 'asc' ? 1 : -1;
        reportData.sort((a, b) => {
          if (filters.sortBy === 'total_commission') {
            return (a.total_commission - b.total_commission) * sortOrder;
          }
          if (filters.sortBy === 'salesman') {
            return a.salesman_name.localeCompare(b.salesman_name) * sortOrder;
          }
          return 0;
        });
      }

      // Calculate grand total
      const grandTotal = reportData.reduce((sum, r) => sum + r.total_commission, 0);

      return {
        report: reportData,
        summary: {
          total_salesmen: reportData.length,
          grand_total_commission: grandTotal
        }
      };
    } catch (error) {
      logger.error(`CommissionRepository calculateCommissionReport error: ${error.message}`);
      throw error;
    }
  }
}

export default new CommissionRepository();



