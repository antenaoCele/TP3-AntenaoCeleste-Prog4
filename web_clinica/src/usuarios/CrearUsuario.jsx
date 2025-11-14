import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router";

export const CrearUsuario = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();
    const [errores, setErrores] = useState(null);

    const [values, setValues] = useState({
        nombre: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrores(null);

        const response = await fetchAuth("http://localhost:4000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            if (response.status === 401) {
                return setErrores(data.errores);
            }
            return window.alert("Error al crear usuario");
        }
        navigate("/usuarios");
    };

    return (
        <article>
            <h2>Crear usuario</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        Nombre
                        <input
                            required
                            value={values.nombre}
                            onChange={(e) =>
                                setValues({ ...values, nombre: e.target.value })
                            }
                            aria-invalid={
                                errores && errores.some((e) => e.path === "nombre")
                            }
                        />
                        {errores && (
                            <small>
                                {errores
                                    .filter((e) => e.path === "nombre")
                                    .map((e) => e.msg)
                                    .join(", ")}
                            </small>
                        )}
                    </label>
                    <label>
                        Email
                        <input
                            required
                            value={values.email}
                            onChange={(e) =>
                                setValues({ ...values, email: e.target.value })
                            }
                            aria-invalid={errores && errores.some((e) => e.path === "email")}
                        />
                        {errores && (
                            <small>
                                {errores
                                    .filter((e) => e.path === "email")
                                    .map((e) => e.msg)
                                    .join(", ")}
                            </small>
                        )}
                    </label>
                    <label>
                        Contraseña
                        <input
                            required
                            type="password"
                            value={values.password}
                            onChange={(e) =>
                                setValues({ ...values, password: e.target.value })
                            }
                            aria-invalid={
                                errores && errores.some((e) => e.path === "password")
                            }
                        />
                        {errores && (
                            <small>
                                {errores
                                    .filter((e) => e.path === "password")
                                    .map((e) => e.msg)
                                    .join(", ")}
                            </small>
                        )}
                    </label>
                </fieldset>
                <input type="submit" value="Crear usuario" />
            </form>
        </article>
    );
};
