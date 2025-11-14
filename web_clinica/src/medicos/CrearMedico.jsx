// CrearMedico.jsx
import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

export function CrearMedico() {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        nombre: "",
        apellido: "",
        especialidad: "",
        matricula: ""
    });

    const [errores, setErrores] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores(null);

        const response = await fetchAuth("http://localhost:4000/medicos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
            setErrores(data.errores || [{ msg: data.message }]);
            return;
        }

        navigate("/medicos");
    };

    return (
        <article>
            <h2>Crear Médico</h2>

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
                        />
                    </label>

                    <label>
                        Apellido
                        <input
                            required
                            value={values.apellido}
                            onChange={(e) =>
                                setValues({ ...values, apellido: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Especialidad
                        <input
                            required
                            value={values.especialidad}
                            onChange={(e) =>
                                setValues({ ...values, especialidad: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Matrícula
                        <input
                            required
                            value={values.matricula}
                            onChange={(e) =>
                                setValues({ ...values, matricula: e.target.value })
                            }
                        />
                    </label>
                </fieldset>

                {errores && (
                    <article style={{ color: "red" }}>
                        <h4>Errores:</h4>
                        <ul>
                            {errores.map((err, i) => (
                                <li key={i}>{err.msg}</li>
                            ))}
                        </ul>
                    </article>
                )}

                <input type="submit" value="Crear Médico" />
            </form>
        </article>
    );
}
