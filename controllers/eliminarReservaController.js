import pool from "../models/basedatos.js";
import { enviarCorreoCancelacionReserva } from "../email/email.js";

export const eliminarReserva = async (req, res) => {
  try {
    const { reservaId, usuarioId, salaId, horaInicio, horaFin, fecha } =
      req.body;

    console.log("Reserva ID recibido:", reservaId);
    console.log("Usuario ID recibido:", usuarioId);

    const obtenerDatosUsuario = `SELECT "Nombre", "Apellidos", "Email" FROM "Usuarios" WHERE "UsuarioId" = $1`;
    const resultadoUsuario = await pool.query(obtenerDatosUsuario, [usuarioId]);
    if (resultadoUsuario.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    const query = `DELETE FROM "Reservas" WHERE "ReservaId" = $1 RETURNING *`;
    const values = [reservaId];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
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

    const { Nombre, Apellidos, Email } = resultadoUsuario.rows[0];
    await enviarCorreoCancelacionReserva(
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
    res
      .status(200)
      .json({ success: true, message: "Reserva eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    res.status(500).json({ message: "Hubo un error al eliminar la reserva" });
  }
};
