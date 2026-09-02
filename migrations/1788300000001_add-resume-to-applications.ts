import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns('applications', {
    resume_filename: {
      type: 'varchar(255)',
    },
    resume_original_name: {
      type: 'varchar(255)',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('applications', ['resume_filename', 'resume_original_name']);
}
