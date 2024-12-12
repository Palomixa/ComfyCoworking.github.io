import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function validarToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Authorization header:", req.headers.authorization);

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token no proporcionado o inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    console.log(
      "Token enviado en el encabezado Authorization:",
      `Bearer ${token}`
    );
    const expDate = new Date(decoded.exp * 1000);
    console.log("Fecha de expiración del token:", expDate);

    if (expDate < new Date()) {
      return res.status(403).json({ error: "Token ha expirado" });
    }
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token invalido o expirado" });
  }
}
export default validarToken;
