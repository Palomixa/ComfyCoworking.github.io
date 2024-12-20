import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import edificiosRoutes from "./routes/edificiosRoutes.js";
import salasRoutes from "./routes/salasRoutes.js";
import reservasRoutes from "./routes/reservasRoutes.js";
import modificarReservaRoutes from "./routes/modificarReservaRoutes.js";
import consultarReservaRoutes from "./routes/consultaReservaRoutes.js";
import eliminarReservaRoutes from "./routes/eliminarReservaRoutes.js";
import { PORT } from "./config/config.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5501",
      "http://127.0.0.1:5501",
      "https://comfycoworking.onrender.com",
    ];

    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
console.log("NODE_ENV:", process.env.NODE_ENV);

app.use(cors(corsOptions));

app.use(express.json());

app.use(authRoutes);
app.use(edificiosRoutes);
app.use(salasRoutes);
app.use(reservasRoutes);
app.use(consultarReservaRoutes);
app.use(modificarReservaRoutes);
app.use(eliminarReservaRoutes);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(__dirname));

app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

app.use("/Login", express.static(path.join(__dirname, "login")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/Login", (req, res) => {
  res.sendFile(path.join(__dirname, "Login", "login.html"));
});

console.log("Servidor escuchando en el puerto", PORT);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
