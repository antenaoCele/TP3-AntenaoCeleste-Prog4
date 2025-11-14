
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate, useParams } from "react-router-dom";

export function EditarMedico() {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [values, setValues] = useState(null);
    const [errores, setErrores] = useState(null);

    const fetchMedico = useCallback(async () => {
        const response = await fetchAuth(`http://localhost:4000/medicos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            console.log("Error:", data.error);
            return;
        }

        setValues(data.data);
    }, [fetchAuth, id]);

    useEffect(() => {
        fetchMedico();
    }, [fetchMedico]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores(null);

        const response = await fetchAuth(`http://localhost:4000/medicos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
            setErrores(data.errores || [{ msg: data.error }]);
            return;
        }

        navigate("/medicos");
    };

    if (!values) return null;

    return (
        <article>
            <h2>Editar Médico</h2>

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

                <input type="submit" value="Actualizar Médico" />
            </form>
        </article>
    );
}
