console.log("Conexión a la base de datos iniciada...");
import pkg from "pg";
import dotenv from "dotenv";
import {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
} from "../config/config.js";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
