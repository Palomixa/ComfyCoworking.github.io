import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL no está configurado correctamente.");
} else {
  console.log("Conexión a la base de datos usando:", process.env.DATABASE_URL);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  log: console.log,
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
