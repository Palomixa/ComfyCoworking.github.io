console.log("Script de conexión a la base de datos iniciado...");

import pkg from "pg";
const { Pool } = pkg;
import {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DATABASE_URL,
} from "./config/config.js";

console.log(
  "Usuario:",
  DB_USER,
  "password:",
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
);
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

pool
  .connect()
  .then(() => {
    console.log("Conexion exitosa");
    return pool.query('SELECT "Nombre" FROM "Edificios"');
  })

  .then((res) => {
    console.log("Resultado de la consulta:", res.rows);
  })
  .catch((err) => {
    console.error("Error al conectar:", err.stack);
  })
  .finally(() => {
    pool.end();
  });
