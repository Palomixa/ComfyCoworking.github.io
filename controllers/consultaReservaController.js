import pool from "../models/basedatos.js";

export const consultarReserva = async (req, res) => {
  const { usuarioId } = req.body;

  console.log("body recibido en el backend:", req.body);

  console.log("UsuarioId:", usuarioId);

  try {
    const result = await pool.query(
      `SELECT r."ReservaId", 
            DATE(r."Fecha") AS "Fecha", 
             r. "HoraInicio", 
             r. "HoraFin",
             s."Nombre" AS "SalaNombre",
             s."SalaId", 
             s."Capacidad",
             e."Nombre" AS "EdificioNombre",
             e."EdificioId"
      FROM "Reservas" r
      JOIN "Salas" s ON r."SalaId" = s."SalaId"
      JOIN "Edificios" e ON s."EdificioId" = e."EdificioId"
      WHERE r."UsuarioId" = $1
      ORDER BY r."Fecha", r."HoraInicio";`,
      [usuarioId]
    );
    console.log("Resultado de la consulta SQL:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res.status(500).send("Error al obtener las reservas");
  }
};
