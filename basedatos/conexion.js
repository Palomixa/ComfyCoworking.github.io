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
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  sslmode: "prefer",
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
