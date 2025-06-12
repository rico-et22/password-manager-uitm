// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db.ts",
  dbCredentials: {
    url: process.env.POSTGRES_URL || ""
  },
});