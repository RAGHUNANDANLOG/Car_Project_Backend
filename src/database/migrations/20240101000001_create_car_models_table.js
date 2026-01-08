/**
 * Create Car Models Table
 * Implements 3NF normalization with appropriate indexes
 */
export const up = async (knex) => {
  // Create car_models table
  await knex.schema.createTable('car_models', (table) => {
    table.increments('id').primary();
    table.string('brand', 50).notNullable();
    table.string('car_class', 20).notNullable();
    table.string('model_name', 255).notNullable();
    table.string('model_code', 10).notNullable().unique();
    table.text('description').notNullable(); // Rich text content (encrypted)
    table.text('features').notNullable(); // Rich text content (encrypted)
    table.decimal('price', 12, 2).notNullable();
    table.timestamp('date_of_manufacturing').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.integer('sort_order').defaultTo(0);
    table.timestamps(true, true);

    // Indexes for search and sorting
    table.index(['brand']);
    table.index(['car_class']);
    table.index(['model_name']);
    table.index(['date_of_manufacturing']);
    table.index(['sort_order']);
    table.index(['is_active']);
  });

  // Create car_model_images table (normalized - 1:N relationship)
  await knex.schema.createTable('car_model_images', (table) => {
    table.increments('id').primary();
    table.integer('car_model_id').unsigned().notNullable()
      .references('id').inTable('car_models').onDelete('CASCADE');
    table.string('filename', 255).notNullable();
    table.string('original_name', 255).notNullable();
    table.string('mime_type', 50).notNullable();
    table.integer('file_size').notNullable();
    table.string('path', 500).notNullable();
    table.boolean('is_default').defaultTo(false);
    table.timestamps(true, true);

    table.index(['car_model_id']);
    table.index(['is_default']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('car_model_images');
  await knex.schema.dropTableIfExists('car_models');
};



