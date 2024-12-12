import express from "express";
import { obtenerSalasPorEdificio } from "../controllers/salasController.js";

const router = express.Router();

router.get("/salas/:edificioId", obtenerSalasPorEdificio);

export default router;
