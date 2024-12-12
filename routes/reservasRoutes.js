import express from "express";
import { crearReserva } from "../controllers/reservasController.js";

const router = express.Router();

router.post("/reservas", crearReserva);

export default router;
