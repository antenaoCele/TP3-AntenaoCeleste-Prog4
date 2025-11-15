import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegistroPublico = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState([]);

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores([]);
        setLoading(true);

        try {
            const response = await fetch("http://localhost:4000/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                if (data.errores) {
                    setErrores(data.errores.map(e => e.msg));
                } else {
                    setErrores([data.message || "Error al crear usuario"]);
                }
                setLoading(false);
                return;
            }

            alert("Usuario creado exitosamente. Ya puedes iniciar sesión.");
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrores(["Error de red al crear usuario"]);
            setLoading(false);
        }
    };

    return (
        <article>
            <h2>Registrarse</h2>

            {errores.length > 0 && (
                <ul style={{ color: "red" }}>
                    {errores.map((e, i) => (
                        <li key={i}>{e}</li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit}>
                <label>Nombre de usuario</label>
                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </article>
    );
};