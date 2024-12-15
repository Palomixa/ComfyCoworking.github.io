console.log("Script de conexión a la base de datos iniciado...");
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

console.log(
  "Usuario:",
  DB_USER,
  "password:",
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
);

export default pool;
