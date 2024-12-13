import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
