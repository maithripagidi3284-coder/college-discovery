import { defineConfig } from "prisma/config";
if (!process.env.VERCEL) {
  require("dotenv").config();
}
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});