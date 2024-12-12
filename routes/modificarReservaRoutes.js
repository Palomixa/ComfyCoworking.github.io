import express from "express";
import { modificarReserva } from "../controllers/modificarReservaController.js";
import { validarToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/modificarReserva", validarToken, modificarReserva);

export default router;
