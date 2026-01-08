/**
 * Commission Report Data Transfer Objects
 * Handles conversion between internal data and API view models
 */

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

/**
 * Convert commission report to view model
 * @param {object} reportData - Raw report data
 * @returns {object} - Formatted view model
 */
export const toViewModel = (reportData) => {
  return {
    report: reportData.report.map(salesman => ({
      salesmanId: salesman.salesman_id,
      salesmanName: salesman.salesman_name,
      salesmanCode: salesman.salesman_code,
      previousYearSales: formatCurrency(salesman.previous_year_sales),
      previousYearSalesRaw: salesman.previous_year_sales,
      qualifiesForBonus: salesman.qualifies_for_bonus,
      commissions: salesman.commissions.map(comm => ({
        brand: comm.brand,
        carClass: comm.car_class,
        unitsSold: comm.units_sold,
        basePercent: comm.base_percent,
        bonusPercent: comm.bonus_percent,
        totalPercent: comm.total_percent,
        fixedCommission: formatCurrency(comm.fixed_commission),
        fixedCommissionRaw: comm.fixed_commission,
        percentCommission: formatCurrency(comm.percent_commission),
        percentCommissionRaw: comm.percent_commission,
        totalCommission: formatCurrency(comm.total_commission),
        totalCommissionRaw: comm.total_commission
      })),
      totalCommission: formatCurrency(salesman.total_commission),
      totalCommissionRaw: salesman.total_commission
    })),
    summary: {
      totalSalesmen: reportData.summary.total_salesmen,
      grandTotalCommission: formatCurrency(reportData.summary.grand_total_commission),
      grandTotalCommissionRaw: reportData.summary.grand_total_commission
    }
  };
};

/**
 * Convert commission report to CSV format
 * @param {object} reportData - Raw report data
 * @returns {array} - Array of objects ready for CSV export
 */
export const toCSVFormat = (reportData) => {
  const rows = [];

  reportData.report.forEach(salesman => {
    salesman.commissions.forEach(comm => {
      rows.push({
        'Salesman Name': salesman.salesman_name,
        'Salesman Code': salesman.salesman_code,
        'Previous Year Sales': salesman.previous_year_sales,
        'Qualifies for Bonus': salesman.qualifies_for_bonus ? 'Yes' : 'No',
        'Brand': comm.brand,
        'Car Class': comm.car_class,
        'Units Sold': comm.units_sold,
        'Base Commission %': comm.base_percent,
        'Bonus %': comm.bonus_percent,
        'Total %': comm.total_percent,
        'Fixed Commission': comm.fixed_commission,
        'Percent Commission': comm.percent_commission,
        'Total Commission': comm.total_commission
      });
    });

    // Add salesman total row
    rows.push({
      'Salesman Name': salesman.salesman_name,
      'Salesman Code': salesman.salesman_code,
      'Previous Year Sales': '',
      'Qualifies for Bonus': '',
      'Brand': 'TOTAL',
      'Car Class': '',
      'Units Sold': '',
      'Base Commission %': '',
      'Bonus %': '',
      'Total %': '',
      'Fixed Commission': '',
      'Percent Commission': '',
      'Total Commission': salesman.total_commission
    });
  });

  // Add grand total row
  rows.push({
    'Salesman Name': 'GRAND TOTAL',
    'Salesman Code': '',
    'Previous Year Sales': '',
    'Qualifies for Bonus': '',
    'Brand': '',
    'Car Class': '',
    'Units Sold': '',
    'Base Commission %': '',
    'Bonus %': '',
    'Total %': '',
    'Fixed Commission': '',
    'Percent Commission': '',
    'Total Commission': reportData.summary.grand_total_commission
  });

  return rows;
};

export default {
  toViewModel,
  toCSVFormat
};



