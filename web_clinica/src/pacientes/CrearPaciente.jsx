import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

export const CrearPaciente = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        nombre: "",
        apellido: "",
        DNI: "",
        nacimiento: "",
        obraSocial: ""
    });

    const [errores, setErrores] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores(null);

        const response = await fetchAuth("http://localhost:4000/pacientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
            setErrores(data.errores || [{ msg: data.error }]);
            return;
        }

        navigate("/pacientes");
    };

    return (
        <article>
            <h2>Crear Paciente</h2>

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
                        DNI
                        <input
                            required
                            value={values.DNI}
                            onChange={(e) =>
                                setValues({ ...values, DNI: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Fecha de Nacimiento
                        <input
                            type="date"
                            required
                            value={values.nacimiento}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    nacimiento: e.target.value
                                })
                            }
                        />
                    </label>

                    <label>
                        Obra Social
                        <input
                            required
                            value={values.obraSocial}
                            onChange={(e) =>
                                setValues({ ...values, obraSocial: e.target.value })
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

                <input type="submit" value="Crear Paciente" />
            </form>
        </article>
    );
};
