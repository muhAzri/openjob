import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('jobs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'varchar(150)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    company_id: {
      type: 'uuid',
      notNull: true,
      references: 'companies',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'uuid',
      notNull: true,
      references: 'categories',
      onDelete: 'CASCADE',
    },
    posted_by: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    location: {
      type: 'varchar(150)',
    },
    employment_type: {
      type: 'varchar(50)',
      notNull: true,
      default: 'full-time',
    },
    salary_min: {
      type: 'integer',
    },
    salary_max: {
      type: 'integer',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('jobs', 'company_id');
  pgm.createIndex('jobs', 'category_id');
  pgm.createIndex('jobs', 'title');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('jobs');
}
