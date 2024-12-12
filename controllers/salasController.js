import pool from "../models/basedatos.js";

export const obtenerSalasPorEdificio = async (req, res) => {
  const { edificioId } = req.params;

  try {
    const query =
      'SELECT "SalaId", "Capacidad", "EdificioId" FROM "Salas" WHERE "EdificioId" = $1';
    const result = await pool.query(query, [edificioId]);
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener las capacidades" });
  }
};
