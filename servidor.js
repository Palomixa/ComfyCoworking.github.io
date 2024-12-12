import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import edificiosRoutes from "./routes/edificiosRoutes.js";
import salasRoutes from "./routes/salasRoutes.js";
import reservasRoutes from "./routes/reservasRoutes.js";
import modificarReservaRoutes from "./routes/modificarReservaRoutes.js";
import consultarReservaRoutes from "./routes/consultaReservaRoutes.js";
import eliminarReservaRoutes from "./routes/eliminarReservaRoutes.js";
import { SERVER_PORT } from "./config/config.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://127.0.0.1:5501",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(authRoutes);
app.use(edificiosRoutes);
app.use(salasRoutes);
app.use(reservasRoutes);
app.use(consultarReservaRoutes);
app.use(modificarReservaRoutes);
app.use(eliminarReservaRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`);
});
