/**
 * Create Sales and Commission Related Tables
 * Implements 3NF normalization
 */
export const up = async (knex) => {
  // Create salesmen table (normalized entity)
  await knex.schema.createTable('salesmen', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('code', 50).unique();
    table.decimal('previous_year_sales', 14, 2).defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    table.index(['name']);
    table.index(['is_active']);
  });

  // Create commission_rules table (normalized lookup)
  await knex.schema.createTable('commission_rules', (table) => {
    table.increments('id').primary();
    table.string('brand', 50).notNullable();
    table.decimal('fixed_commission', 10, 2).notNullable();
    table.decimal('price_threshold', 12, 2).notNullable();
    table.decimal('class_a_percent', 5, 2).notNullable();
    table.decimal('class_b_percent', 5, 2).notNullable();
    table.decimal('class_c_percent', 5, 2).notNullable();
    table.timestamps(true, true);

    table.unique(['brand']);
  });

  // Create sales_data table (normalized sales records)
  await knex.schema.createTable('sales_data', (table) => {
    table.increments('id').primary();
    table.integer('salesman_id').unsigned().notNullable()
      .references('id').inTable('salesmen').onDelete('CASCADE');
    table.string('car_class', 20).notNullable();
    table.integer('audi_count').defaultTo(0);
    table.integer('jaguar_count').defaultTo(0);
    table.integer('land_rover_count').defaultTo(0);
    table.integer('renault_count').defaultTo(0);
    table.timestamps(true, true);

    table.unique(['salesman_id', 'car_class']);
    table.index(['salesman_id']);
    table.index(['car_class']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('sales_data');
  await knex.schema.dropTableIfExists('commission_rules');
  await knex.schema.dropTableIfExists('salesmen');
};



