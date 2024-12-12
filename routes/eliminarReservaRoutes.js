import express from "express";
import { eliminarReserva } from "../controllers/eliminarReservaController.js";
import validarToken from "../middlewares/auth.js";

const router = express.Router();

router.post("/eliminarReserva", validarToken, eliminarReserva);

export default router;
