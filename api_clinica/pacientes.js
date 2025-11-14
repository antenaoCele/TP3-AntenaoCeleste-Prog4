import express from "express";
import { db } from "./db.js";
import { body, query } from "express-validator";
import { validarId, verificarValidaciones, validarPacientes } from "./validaciones.js";
import passport from "passport";
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

// ------------GET------------
router.get('/', async (req, res) => {
    const { nombre, apellido, DNI, nacimiento, obraSocial } = req.query;


    let sql = "SELECT * FROM pacientes";

    const [rows] = await db.execute(sql);
    res.json({ success: true, data: rows });
});

//get por id 
router.get('/:id', validarId, verificarValidaciones, async (req, res) => {
    const { id } = req.params;


    const [rows] = await db.execute("SELECT * FROM pacientes WHERE id = ?", [id]);

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, error: "Paciente no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
});

// ------------GET------------



// ------------POST------------ 
router.post("/", validarPacientes, verificarValidaciones, async (req, res) => {
    const { nombre, apellido, DNI, nacimiento, obraSocial } = req.body;

    const [result] = await db.execute(
        "INSERT INTO pacientes (nombre, apellido, DNI, nacimiento, obraSocial) VALUES (?,?,?,?,?)",
        [nombre, apellido, DNI, nacimiento, obraSocial]
    );


    res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, apellido, DNI, nacimiento, obraSocial },
    });
});
// ------------POST------------ 



// ------------PUT-------------
router.put(
    "/:id",
    validarId,
    validarPacientes,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nombre, apellido, DNI, nacimiento, obraSocial } = req.body;

        const [existe] = await db.execute("SELECT * FROM usuarios WHERE id=?", [id]);
        if (existe.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }

        await db.execute(
            "UPDATE pacientes SET nombre=?, apellido=?, DNI=?, nacimiento=?, obraSocial=?  WHERE id=?",
            [nombre, apellido, DNI, nacimiento, obraSocial, id]
        );

        res.json({
            success: true,
            data: { id, nombre, apellido, DNI, nacimiento, obraSocial }
        });
    }
);

// ------------PUT-------------



// ------------DELETE------------

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [existe] = await db.execute("SELECT * FROM usuarios WHERE id=?", [id]);
    if (existe.length === 0) {
        return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    await db.execute("DELETE FROM pacientes WHERE id=?", [id]);
    res.json({ success: true, data: id });
});

// ------------DELETE------------

export default router;