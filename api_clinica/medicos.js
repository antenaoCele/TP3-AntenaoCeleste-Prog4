import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
const router = express.Router();


// ------------Validaciones------------

const validarId = param("id").isInt({ min: 1 });

const validarMedico = [
    body("nombre")
        .isString().withMessage("El nombre debe ser una cadena de texto")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),


    body("apellido")
        .isString().withMessage("El nombre debe ser una cadena de texto")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),


    body("especialidad")
        .isString().withMessage("La especialdad debe ser una cadena de texto")
        .notEmpty().withMessage("Campo obligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("La especialidad debe tener entre 3 y 50 caracteres"),

    body("matricula")
        .notEmpty().withMessage("Campo obligatorio")
];

const verificarValidaciones = (req, res, next) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Falla de validacion",
            errores: validacion.array(),
        });
    }
    next();
};
// ------------Validaciones------------


// ------------GET------------
router.get('/', async (req, res) => {
    const { nombre, apellido, especialidad, matricula } = req.query;


    let sql = "SELECT * FROM medicos";

    const [rows] = await db.execute(sql);
    res.json({ success: true, data: rows });
});
// ------------GET------------




// POST para crear rectangulo
router.post("/", validarMedico, verificarValidaciones, async (req, res) => {
    const { nombre, apellido, especialidad, matricula } = req.body;

    const [existeMatricula] = await db.execute("SELECT * FROM medicos WHERE LOWER(matricula)=LOWER(?)", [matricula]);

    if (existeMatricula.length > 0) {
        return res.status(404).json({
            success: false,
            message: "Ya existe esta matricula",
        });
    }

    const [result] = await db.execute(
        "INSERT INTO medicos (nombre, apellido, especialidad, matricula) VALUES (?,?,?,?)",
        [nombre, apellido, especialidad, matricula]
    );


    res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, apellido, especialidad, matricula },
    });
});



export default router;
