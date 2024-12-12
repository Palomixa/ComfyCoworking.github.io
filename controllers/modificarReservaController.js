import pool from "../models/basedatos.js";
import { enviarCorreoModificacionReserva } from "../email/email.js";

export const modificarReserva = async (req, res) => {
  console.log("modificarReserva()");
  const { reservaId, usuarioId, salaId, fecha, horaInicio, horaFin } = req.body;

  console.log("Usuario ID recibido:", usuarioId);
  console.log("Datos de la reserva a modificar:", {
    usuarioId,
    reservaId,
    salaId,
    fecha,
    horaInicio,
    horaFin,
  });

  if (!usuarioId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    const verificarSala = `SELECT "SalaId" FROM "Salas" WHERE "SalaId" = $1`;
    const resultSala = await pool.query(verificarSala, [salaId]);
    if (resultSala.rows.length === 0) {
      return res.status(400).json({
        error: "La sala seleccionada no pertenece al edificio indicado.",
      });
    }

    const obtenerDatosUsuario = `SELECT "Nombre", "Apellidos", "Email" FROM "Usuarios" WHERE "UsuarioId" = $1`;
    const resultadoUsuario = await pool.query(obtenerDatosUsuario, [usuarioId]);
    if (resultadoUsuario.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const reservaExistente = `SELECT * FROM "Reservas" WHERE "SalaId" = $1 AND "Fecha" = $2
      AND (("HoraInicio" <= $3 AND "HoraFin" > $3) OR
      ("HoraInicio" < $4 and "HoraFin" >= $4) OR
      ("HoraInicio" >= $3 AND "HoraFin" <= $4)) AND "ReservaId" != $5`;

    const valuesReservaExistente = [
      salaId,
      fecha,
      horaInicio,
      horaFin,
      reservaId,
    ];
    const resultadoReservaExistente = await pool.query(
      reservaExistente,
      valuesReservaExistente
    );

    if (resultadoReservaExistente.rows.length > 0) {
      return res.status(400).json({
        error: "Ya existe una reserva en este horario para esta sala.",
      });
    }

    const obtenerDatosSala = `
      SELECT s."Nombre" AS "nombreSala", s."Capacidad", e."Nombre" AS "nombreEdificio", e."Direccion"
      FROM "Salas" s
      JOIN "Edificios" e ON s."EdificioId" = e."EdificioId"
      WHERE s."SalaId" = $1
    `;
    const resultSalaEdificio = await pool.query(obtenerDatosSala, [salaId]);
    if (resultSalaEdificio.rows.length === 0) {
      return res.status(400).json({
        error: "No se encontró la sala o el edificio.",
      });
    }

    const { nombreSala, Capacidad, nombreEdificio, Direccion } =
      resultSalaEdificio.rows[0];

    const actualizarReserva = `UPDATE "Reservas" 
      SET "SalaId" = $1, "Fecha" = $2, "HoraInicio" = $3, "HoraFin" = $4 
      WHERE "ReservaId" = $5 RETURNING *`;

    const valuesActualizarReserva = [
      salaId,
      fecha,
      horaInicio,
      horaFin,
      reservaId,
    ];
    const resultadoReserva = await pool.query(
      actualizarReserva,
      valuesActualizarReserva
    );

    const { Nombre, Apellidos, Email } = resultadoUsuario.rows[0];
    await enviarCorreoModificacionReserva(
      Nombre,
      Apellidos,
      Email,
      nombreEdificio,
      Direccion,
      Capacidad,
      nombreSala,
      horaInicio,
      horaFin,
      fecha
    );
    res.status(200).json({
      success: true,
      message: "Reserva modificada con éxito",
      reserva: resultadoReserva.rows[0],
    });
  } catch (error) {
    console.error("Error al modificar la reserva:", error);
    res.status(500).json({ error: "Error al modificar la reserva." });
  }
};
