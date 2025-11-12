import { param, validationResult, body } from "express-validator";
import { db } from "./db.js";


//VALIDAR ID
export const validarId = param("id").isInt({ min: 1 });


//-------------------------VALIDACION PARA AUTH-------------------------
export const validarAuth = [
    body("nombre")
        .isAlphanumeric("es-ES").isLength({ max: 20 }),
    body("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        }).withMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.")

]
//----------------------------------------------------------------------


//-------------------------VALIDACION PARA USUARIOS-------------------------
export const validarUsuario = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio.")
        .isLength({ max: 50 }).withMessage("El nombre debe tener menos de 50 caracteres."),
    body("email")
        .trim()
        .notEmpty().withMessage("El email es obligatorio.")
        .isEmail().withMessage("Debe ser un email válido."),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria.")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        })

]
//----------------------------------------------------------------------





//---------------------VALIDACION PARA MEDICOS--------------------------
export const validarMedico = [
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


    body("especialidad")
        .isString().withMessage("La especialdad debe ser una cadena de texto")
        .not().isNumeric().withMessage("La especialidad no puede ser un número")
        .notEmpty().withMessage("Campo obligatorio")
        .isLength({ min: 3, max: 50 }).withMessage("La especialidad debe tener entre 3 y 50 caracteres"),

    body("matricula")
        .notEmpty().withMessage("Campo obligatorio")
        .isLength({ min: 10, max: 11 }).withMessage("La matricula debe tener entre 10 y 11 caracteres")
        .custom(async (value, { req }) => {
            const [existe] = await db.execute(
                "SELECT * FROM medicos WHERE matricula = ?",
                [value]
            );

            if (existe.length > 0 && existe[0].id !== Number(req.params.id)) {
                throw new Error("Ya existe otro médico con esta matricula.");
            }

            return true;
        })
];
//-----------------------------------------------------------------------


//-----------------------VALIDACION PARA PACIENTES-----------------------
export const validarPacientes = [
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
                "SELECT * FROM pacientes WHERE dni = ?",
                [value]
            );

            if (existe.length > 0 && Number(existe[0].id) !== Number(req.params.id)) {
                throw new Error("Ya existe otro paciente con este DNI.");
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
//-----------------------------------------------------------------------


//-----------------------VALIDACION PARA LOS TURNOS----------------------
export const validarTurnos = [
    body("paciente_id")
        .isInt({ min: 1 }).withMessage("El ID del paciente debe ser un número entero positivo.")
        .custom(async (value) => {
            const [rows] = await db.execute("SELECT * FROM pacientes WHERE id = ?", [value]);
            if (rows.length === 0) {
                throw new Error("El paciente no existe.");
            }
            return true;
        }),
    body("medico_id")
        .isInt({ min: 1 }).withMessage("El ID del médico debe ser un número entero positivo.")
        .custom(async (value) => {
            const [rows] = await db.execute("SELECT * FROM medicos WHERE id = ?", [value]);
            if (rows.length === 0) {
                throw new Error("El médico no existe.");
            }
            return true;
        }),
    body("fecha")
        .notEmpty().withMessage("La fecha es obligatoria.")
        .isISO8601().withMessage("La fecha debe tener un formato válido (YYYY-MM-DD).")
        .custom((value) => {
            const fechaTurno = new Date(value);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fechaTurno < hoy) {
                throw new Error("La fecha del turno no puede ser en el pasado.");
            }
            return true;
        }),
    body("hora")
        .notEmpty().withMessage("La hora es obligatoria.")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("La hora debe tener un formato válido (HH:MM).")
        .custom(async (value, { req }) => {
            const { medico_id, fecha } = req.body;

            if (!medico_id || !fecha) return true;

            const [existe] = await db.execute(
                "SELECT * FROM turnos WHERE medico_id = ? AND fecha = ? AND hora = ?",
                [medico_id, fecha, value]
            );

            if (existe.length > 0) {
                throw new Error("El médico ya tiene un turno en ese horario.");
            }

            return true;
        }),
    body("estado")
        .isString().withMessage("El estado debe ser una cadena de texto.")
        .isIn(['pendiente', 'atendido', 'cancelado']).withMessage("El estado debe ser: 'pendiente', 'atendido' o 'cancelado'."),
    body("observaciones")
        .isString().withMessage("Las observaciones deben ser una cadena de texto.")
        .isLength({ max: 200 }).withMessage("Coloca un texto de 200 caracteres como máximo.")
];
//-----------------------------------------------------------------------



//----------------------VERIFICAR VALIDACIONES----------------------
export const verificarValidaciones = (req, res, next) => {
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
//--------------------------------------------------------------------