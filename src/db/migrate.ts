import { db } from './index';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
};
main();
