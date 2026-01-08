/**
 * Seed Salesmen and Sales Data
 * Based on the requirements specification
 */
export const seed = async (knex) => {
  // Clear existing data
  await knex('sales_data').del();
  await knex('salesmen').del();

  // Insert salesmen with previous year sales
  const salesmen = await knex('salesmen').insert([
    { name: 'John Smith', code: 'SM001', previous_year_sales: 490000 },
    { name: 'Richard Porter', code: 'SM002', previous_year_sales: 1000000 },
    { name: 'Tony Grid', code: 'SM003', previous_year_sales: 650000 }
  ]).returning('*');

  const salesman1 = salesmen.find(s => s.code === 'SM001');
  const salesman2 = salesmen.find(s => s.code === 'SM002');
  const salesman3 = salesmen.find(s => s.code === 'SM003');

  // Insert sales data as per specification
  await knex('sales_data').insert([
    // Salesman 1 (John Smith) - Previous year: $490,000
    { salesman_id: salesman1.id, car_class: 'A-Class', audi_count: 1, jaguar_count: 3, land_rover_count: 0, renault_count: 6 },
    { salesman_id: salesman1.id, car_class: 'B-Class', audi_count: 2, jaguar_count: 4, land_rover_count: 2, renault_count: 2 },
    { salesman_id: salesman1.id, car_class: 'C-Class', audi_count: 3, jaguar_count: 6, land_rover_count: 1, renault_count: 1 },

    // Salesman 2 (Richard Porter) - Previous year: $1,000,000 (qualifies for 2% bonus on Class A)
    { salesman_id: salesman2.id, car_class: 'A-Class', audi_count: 0, jaguar_count: 5, land_rover_count: 5, renault_count: 3 },
    { salesman_id: salesman2.id, car_class: 'B-Class', audi_count: 0, jaguar_count: 4, land_rover_count: 2, renault_count: 2 },
    { salesman_id: salesman2.id, car_class: 'C-Class', audi_count: 0, jaguar_count: 2, land_rover_count: 1, renault_count: 1 },

    // Salesman 3 (Tony Grid) - Previous year: $650,000 (qualifies for 2% bonus on Class A)
    { salesman_id: salesman3.id, car_class: 'A-Class', audi_count: 4, jaguar_count: 2, land_rover_count: 1, renault_count: 6 },
    { salesman_id: salesman3.id, car_class: 'B-Class', audi_count: 2, jaguar_count: 7, land_rover_count: 2, renault_count: 3 },
    { salesman_id: salesman3.id, car_class: 'C-Class', audi_count: 0, jaguar_count: 1, land_rover_count: 3, renault_count: 1 }
  ]);
};



