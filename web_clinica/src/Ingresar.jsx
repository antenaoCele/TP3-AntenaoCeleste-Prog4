import { useState } from "react";
import { useAuth } from "./Auth";

export const Ingresar = () => {
    const { error, login, setError } = useAuth();

    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!nombre.trim() || !password) {
            setError("El nombre de usuario y la contraseña son obligatorios.");
            return;
        }

        setLoading(true);
        const result = await login(nombre.trim(), password);
        setLoading(false);

        if (result.success) {
            setOpen(false);
        }
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>Ingresar</button>
            <dialog open={open}>
                <article>
                    <h2>Ingresar nombre y contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <label htmlFor="nombre">Usuario:</label>
                            <input
                                name="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </fieldset>
                        <footer>
                            <div className="grid">
                                <input
                                    type="button"
                                    className="secondary"
                                    value="Cancelar"
                                    onClick={() => setOpen(false)}
                                />
                                <input
                                    type="submit"
                                    value="Ingresar"
                                    aria-busy={loading}
                                />
                            </div>
                        </footer>
                    </form>
                </article>
            </dialog>
        </>
    );
};
