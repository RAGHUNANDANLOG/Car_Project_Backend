/**
 * Seed Commission Rules
 * Based on the requirements specification
 */
export const seed = async (knex) => {
  // Clear existing data
  await knex('commission_rules').del();

  // Insert commission rules as per specification
  await knex('commission_rules').insert([
    {
      brand: 'Audi',
      fixed_commission: 800,
      price_threshold: 25000,
      class_a_percent: 8,
      class_b_percent: 6,
      class_c_percent: 4
    },
    {
      brand: 'Jaguar',
      fixed_commission: 750,
      price_threshold: 35000,
      class_a_percent: 6,
      class_b_percent: 5,
      class_c_percent: 3
    },
    {
      brand: 'Land Rover',
      fixed_commission: 850,
      price_threshold: 30000,
      class_a_percent: 7,
      class_b_percent: 5,
      class_c_percent: 4
    },
    {
      brand: 'Renault',
      fixed_commission: 400,
      price_threshold: 20000,
      class_a_percent: 5,
      class_b_percent: 3,
      class_c_percent: 2
    }
  ]);
};



