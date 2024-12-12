import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CCoworking",
  password: process.env.BD_PASSWORD,
  port: 5432,
});

export default pool;
