// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"], // 👈 Essencial para rodar com o Prisma v7 + Turbopack
};

export default nextConfig;