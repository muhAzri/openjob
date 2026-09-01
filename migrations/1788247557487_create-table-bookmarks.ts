import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('bookmarks', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    job_id: {
      type: 'uuid',
      notNull: true,
      references: 'jobs',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('bookmarks', 'unique_bookmark_job_id_and_user_id', 'UNIQUE(job_id, user_id)');
  pgm.createIndex('bookmarks', 'user_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('bookmarks');
}
