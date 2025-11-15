import express from "express";
import { db } from "./db.js";
import { body, query } from "express-validator";
import { validarId, verificarValidaciones, validarMedico } from "./validaciones.js";
import passport from "passport";
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

// ------------GET------------
router.get('/', async (req, res) => {

    let sql = "SELECT * FROM medicos";

    const [rows] = await db.execute(sql);
    res.json({ success: true, data: rows });
});

//get por id 
router.get('/:id', validarId, verificarValidaciones, async (req, res) => {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM medicos WHERE id = ?", [id]);

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Médico no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
});

// ------------GET------------



// ------------POST------------ 
router.post("/", validarMedico, verificarValidaciones, async (req, res) => {
    const { nombre, apellido, especialidad, matricula } = req.body;

    const [result] = await db.execute(
        "INSERT INTO medicos (nombre, apellido, especialidad, matricula) VALUES (?,?,?,?)",
        [nombre, apellido, especialidad, matricula]
    );


    res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, apellido, especialidad, matricula },
    });
});
// ------------POST------------ 



// ------------PUT-------------
router.put(
    "/:id",
    validarId,
    validarMedico,
    verificarValidaciones,
    async (req, res) => {
        const id = Number(req.params.id);
        const { nombre, apellido, especialidad, matricula } = req.body;

        const [rows] = await db.execute("SELECT * FROM medicos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Médico no encontrado" });
        }

        await db.execute(
            "UPDATE medicos SET nombre=?, apellido=?, especialidad=?, matricula=?  WHERE id=?",
            [nombre, apellido, especialidad, matricula, id]
        );

        res.json({
            success: true,
            data: { id, nombre, apellido, especialidad, matricula }
        });
    }
);

// ------------PUT-------------



// ------------DELETE------------

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [rows] = await db.execute("SELECT * FROM medicos WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Médico no encontrado" });
    }

    await db.execute("DELETE FROM medicos WHERE id=?", [id]);
    res.json({ success: true, data: id });
});

// ------------DELETE------------

export default router;