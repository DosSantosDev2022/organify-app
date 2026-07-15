import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Para migrações do Supabase, o ideal é usar a ligação direta (DIRECT_URL) no CLI
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});