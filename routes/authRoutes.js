import express from "express";
import { registro, login } from "../controllers/authController.js";
import { validarToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);

export default router;
