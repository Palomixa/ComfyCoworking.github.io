import express from "express";
import { consultarReserva } from "../controllers/consultaReservaController.js";
import { validarToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/consultarReserva", validarToken, consultarReserva);

export default router;
