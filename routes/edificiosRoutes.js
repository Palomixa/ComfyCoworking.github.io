import express from "express";
import { obtenerEdificios } from "../controllers/edificiosController.js";

const router = express.Router();

router.get("/edificios", obtenerEdificios);

export default router;
