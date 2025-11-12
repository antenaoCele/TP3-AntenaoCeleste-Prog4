import express from "express";
import { conectarDB } from "./db.js";
import medicosRouter from "./medicos.js";
import pacientesRouter from "./pacientes.js";
import turnosRouter from "./turnos.js";
import usuariosRouter from "./usuarios.js";
import authRouter from "./auth.js";
import cors from "cors";
import { authConfig } from "./auth.js";

conectarDB();

const app = express();
const port = 4000;

app.use(express.json());

// Habilito CORS
app.use(cors());

authConfig();

app.get("/", (req, res) => {
    res.send("Hola mundo!");
});


app.use("/medicos", medicosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/turnos", turnosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`La aplicación esta funcionando en el puerto ${port}`);
});