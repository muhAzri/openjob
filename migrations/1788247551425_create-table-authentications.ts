import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('authentications', {
    token: {
      type: 'text',
      notNull: true,
      unique: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('authentications');
}
