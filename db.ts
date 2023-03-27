import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
export let client = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

client.connect().catch((err) => {
  console.error("failed to connect to database", err);
});
