import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();

    table.uuid('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.enum('type', ['fund', 'withdraw', 'transfer']).notNullable();

    table.decimal('amount', 12, 2).notNullable();

    table.uuid('recipientId')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.text('description').nullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions');
}
