import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('userName').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}

