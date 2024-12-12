import pool from "../models/basedatos.js";

export const obtenerEdificios = async (req, res) => {
  try {
    const query = 'SELECT "EdificioId", "Nombre" FROM "Edificios"';
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener las opciones" });
  }
};
