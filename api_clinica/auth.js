import express from "express";
import { db } from "./db.js";
import { verificarValidaciones, validarId, validarAuth } from "./validaciones.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };


    passport.use(
        new Strategy(jwtOptions, async (payload, next) => {
            next(null, payload);
        })
    );
}

router.post(
    "/login",
    validarAuth,
    verificarValidaciones,
    async (req, res) => {
        const { nombre, password } = req.body;

        const [rows] = await db.execute("SELECT * FROM usuarios WHERE nombre=?", [
            nombre
        ]);

        if (rows.length === 0) {
            return res
                .status(401)
                .json({ success: false, error: "Usuario inválido" });
        }


        const hashedPassword = rows[0].password_hash;

        const passwordComparada = await bcrypt.compare(password, hashedPassword);

        if (!passwordComparada) {
            return res
                .status(401)
                .json({ success: false, error: "Error al iniciar sesion" });
        }

        // Generar jwt
        const payload = { userId: rows[0].id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "14400s",
        });

        // Devolver jwt
        res.json({ success: true, token });
    }
);

export default router;
