import pkg from "pg";
const { Pool } = pkg;
import { config } from "dotenv";
config();

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL no está configurado correctamente.");
} else {
  console.log("Conexión a la base de datos usando:", DATABASE_URL);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log(DATABASE_URL);

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
