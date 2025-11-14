import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones, validarUsuario } from "./validaciones.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";

const router = express.Router();

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {

        const [rows] = await db.execute("SELECT * FROM usuarios");
        res.json({
            success: true,
            usuarios: rows.map((u) => ({ ...u, password_hash: undefined })),
        });
    }
);

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
        "SELECT id, nombre, email FROM usuarios WHERE id=?",
        [id]
    );

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, error: "Usuario no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
});

router.post(
    "/",
    validarUsuario,
    verificarValidaciones,
    async (req, res) => {
        const { nombre, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            "INSERT INTO usuarios (nombre, password_hash, email) VALUES (?,?,?)",
            [nombre, hashedPassword, email]
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, nombre, email },
        });
    }
);

router.put("/:id",
    validarId,
    body("nombre").optional().trim().notEmpty().withMessage("El nombre es obligatorio.").isLength({ max: 50 }).withMessage("El nombre debe tener menos de 50 caracteres."),
    body("email").optional().trim().notEmpty().withMessage("El email es obligatorio.").isEmail().withMessage("Debe ser un email válido."),
    body("password").optional().notEmpty().withMessage("La contraseña es obligatoria.").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }).withMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."),
    verificarValidaciones,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { nombre, password, email } = req.body;
        const { id } = req.params;

        const [rows] = await db.execute("SELECT * FROM usuarios WHERE id=?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }

        const usuario = rows[0];
        const newNombre = nombre || usuario.nombre;
        const newEmail = email || usuario.email;
        const hashedPassword = password ? await bcrypt.hash(password, 12) : usuario.password_hash;

        await db.execute(
            "UPDATE usuarios SET nombre=?, password_hash=?, email=? WHERE id=?",
            [newNombre, hashedPassword, newEmail, id]
        );

        return res.status(200).json({
            success: true, // Corregido para devolver los datos actualizados
            data: { id: Number(id), nombre: newNombre, email: newEmail },
        });

    });


router.delete("/:id", validarId, verificarValidaciones,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;

        await db.execute("DELETE FROM usuarios WHERE id=?", [id]);

        res.json({ success: true, message: "Usuario eliminado" });
    });


export default router;
