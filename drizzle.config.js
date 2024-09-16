/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://unicapp_owner:AGIZDjkMu8S6@ep-shrill-feather-a54zxtvx.us-east-2.aws.neon.tech/unicapp?sslmode=require',
  }
};