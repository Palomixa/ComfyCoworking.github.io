import pool from "../models/basedatos.js";
import { enviarCorreoReserva } from "../email/email.js";

export const crearReserva = async (req, res) => {
  const { usuarioId, salaId, fecha, horaInicio, horaFin } = req.body;

  console.log("Usuario ID recibido:", usuarioId);
  console.log("Datos de la reserva recibidos en el servidor:", {
    usuarioId,
    salaId,
    fecha,
    horaInicio,
    horaFin,
  });
  console.log("Usuario ID desde el middleware:", usuarioId);

  if (!usuarioId) {
    return res.status(401).json({ error: "usuario no auntenticado" });
  }
  console.log("usuario ID desde la sesion:", usuarioId);

  try {
    const verificarSala = `SELECT "SalaId" FROM "Salas" WHERE "SalaId" = $1`;
    const resultSala = await pool.query(verificarSala, [salaId]);
    console.log("Resultado de verificar sala:", verificarSala);
    console.log(resultSala);
    if (resultSala.rows.length === 0) {
      return res.status(400).json({
        error: "La sala seleccionada no pertenece al edificio indicado.",
      });
    }

    const obtenerDatosUsuario = `SELECT "Nombre", "Apellidos", "Email" FROM "Usuarios" WHERE "UsuarioId" = $1`;
    const resultadoUsuario = await pool.query(obtenerDatosUsuario, [usuarioId]);
    console.log("Resultado de la consulta Usuario:", resultadoUsuario.rows);
    if (resultadoUsuario.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const reservaExistente = `SELECT * FROM "Reservas" WHERE "SalaId"= $1 AND "Fecha" = $2
      AND (("HoraInicio" <= $3 AND "HoraFin" > $3)OR
      ("HoraInicio" < $4 and "HoraFin" >= $4)OR
      ("HoraInicio" >= $3 AND "HoraFin" <= $4))`;

    const valuesReservaExistente = [salaId, fecha, horaInicio, horaFin];
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
     SELECT s."Nombre" AS "nombreSala",s."Capacidad", e."Nombre" AS "nombreEdificio", e."Direccion"
     FROM "Salas" s
     JOIN "Edificios" e ON s."EdificioId" = e."EdificioId"
     WHERE s."SalaId" = $1
    `;
    const resultSalaEdificio = await pool.query(obtenerDatosSala, [salaId]);
    console.log(
      "Resultado de la consulta Sala y Edificio:",
      resultSalaEdificio.rows
    );
    if (resultSalaEdificio.rows.length === 0) {
      return res.status(400).json({
        error: "No se encontró la sala o el edificio.",
      });
    }

    const { nombreSala, Capacidad, nombreEdificio, Direccion } =
      resultSalaEdificio.rows[0];

    console.log("Datos obtenidos de la reserva:", {
      nombreSala,
      nombreEdificio,
      Direccion,
      Capacidad,
      horaInicio,
      horaFin,
      fecha,
    });

    const insertarReserva = `INSERT INTO "Reservas"("UsuarioId","SalaId", "Fecha",
      "HoraInicio", "HoraFin")VALUES ($1,$2,$3,$4,$5) RETURNING * `;

    const valuesInsertarReserva = [
      usuarioId,
      salaId,
      fecha,
      horaInicio,
      horaFin,
    ];
    const resultadoReserva = await pool.query(
      insertarReserva,
      valuesInsertarReserva
    );

    const { Nombre, Apellidos, Email } = resultadoUsuario.rows[0];

    await enviarCorreoReserva(
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

    res.status(201).json({
      success: true,
      message: "Reserva realizada con exito",
      reserva: resultadoReserva.rows[0],
    });
  } catch (error) {
    console.error("Error al realizar la reserva:", error);
    res.status(500).json({ error: "Error al realizar la reserva." });
  }
};
