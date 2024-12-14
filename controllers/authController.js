import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/basedatos.js";
import { enviarCorreoConfirmacion } from "../email/email.js";

export const registro = async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;
  if (typeof password !== "string" || password.trim() === "") {
    return res
      .status(400)
      .json({ error: "La contraseña debe ser una cadena de texto válida." });
  }
  try {
    const usuarioExistente = await pool.query(
      'SELECT * FROM "Usuarios" WHERE "Email" = $1',
      [email]
    );
    if (usuarioExistente.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe otro usuario con el mismo email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "Usuarios" ("Nombre","Apellidos","Email","Password") VALUES ($1,$2,$3,$4) RETURNING * ',
      [nombre, apellidos, email, hashedPassword]
    );

    await enviarCorreoConfirmacion(nombre, apellidos, email);

    return res.status(201).json({
      message: " Usuario registrado con exito.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  console.log("Login request received");
  const { email, password } = req.body;
  console.log("email:", email, "password:", password);
  try {
    const result = await pool.query(
      'SELECT * FROM "Usuarios" WHERE "Email" = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "El email o la contraseña son incorrectos." });
    }
    const user = result.rows[0];

    if (!user.Password) {
      console.error("Error: La contraseña del usuario es undefined");
      return res.status(500).json({
        error: "Error en el servidor: Contraseña no encontrada para el usuario",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.Password);
    console.log("Contraseña proporcionada:", password);
    console.log("Contraseña almacenada en la base de datos:", user.Password);
    console.log("¿Contraseñas coinciden?", passwordMatch);

    if (!passwordMatch) {
      console.log("La contraseña no coincide con la almacenada.");
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    console.log("Contraseña correcta, generando token...");
    const token = jwt.sign(
      { email: user.Email, nombre: user.Nombre, id: user.UsuarioId },

      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("usuario logueado:", user);

    return res.status(200).json({ ok: true, message: token });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error en el inicio de sesion" });
  }
};
