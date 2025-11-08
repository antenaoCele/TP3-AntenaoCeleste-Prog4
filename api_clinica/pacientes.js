import express from "express";
import { db } from "./db.js";
import { body, query } from "express-validator";
import { validarId, verificarValidaciones } from "./validaciones.js";
const router = express.Router();


// ------------Validaciones------------

const validarPacientes = [
    body("nombre")
        .isString().withMessage("El nombre debe ser una cadena de texto")
        .not().isNumeric().withMessage("Debes ingresar solo letras")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),


    body("apellido")
        .isString().withMessage("El apellido debe ser una cadena de texto")
        .not().isNumeric().withMessage("Debes ingresar solo letras")
        .notEmpty().withMessage("El apellido es obligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("El apellido debe tener entre 3 y 50 caracteres"),


    body("obraSocial")
        .isString().withMessage("La obra social debe ser una cadena de texto")
        .not().isNumeric().withMessage("La obra social no puede ser un número")
        .notEmpty().withMessage("Campo obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("La obra social debe tener entre 2 y 50 caracteres"),


    body("DNI")
        .trim()
        .notEmpty().withMessage("El DNI es obligatorio.")
        .isNumeric().withMessage("El DNI solo puede contener números.")
        .isLength({ min: 7, max: 8 }).withMessage("El DNI debe tener entre 7 y 8 dígitos.")
        .custom(async (value, { req }) => {
            const [existe] = await db.execute(
                "SELECT * FROM medicos WHERE dni = ?",
                [value]
            );

            if (existe.length > 0 && Number(existe[0].id) !== Number(req.query.id)) {
                throw new Error("Ya existe otro médico con este DNI.");
            }

            return true;
        }),


    body("nacimiento")
        .notEmpty().withMessage("La fecha de nacimiento es obligatoria.")
        .isISO8601().withMessage("La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD).")
        .custom((value) => {
            const fecha = new Date(value);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fecha.getFullYear();
            if (fecha > hoy) {
                throw new Error("La fecha de nacimiento no puede ser futura.");
            }
            if (edad < 5) {
                throw new Error("Debe tener al menos 5 años.");
            }
            if (edad > 120) {
                throw new Error("La edad ingresada no es válida.");
            }
            return true;
        })
];

// ------------Validaciones------------


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

    const [rows] = await db.execute("SELECT * FROM medicos WHERE id = ?", [id]);

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
});

// ------------GET------------



// ------------POST------------ 
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

        const [existeMatricula] = await db.execute("SELECT * FROM medicos WHERE LOWER(matricula)=LOWER(?)", [matricula]);

        if (existeMatricula.length > 0) {
            return res.status(404).json({
                success: false,
                message: "Ya existe esta matricula",
            });
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

    await db.execute("DELETE FROM medicos WHERE id=?", [id]);
    res.json({ success: true, data: id });
});

// ------------DELETE------------

export default router;