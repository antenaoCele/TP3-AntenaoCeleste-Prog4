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
            .json({ success: false, message: "Usuario no encontrado" });
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

router.put("/:id", (req, res) => { });
router.delete("/:id", (req, res) => { });


export default router;
