import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './workers/shared/schema.ts',
  out: './migrations',
});
