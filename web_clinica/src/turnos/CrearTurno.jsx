import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

export const CrearTurno = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        paciente_id: "",
        medico_id: "",
        fecha: "",
        hora: "",
        estado: "pendiente",
        observaciones: ""
    });

    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [errores, setErrores] = useState(null);


    const fetchPacientes = useCallback(async () => {
        const response = await fetchAuth("http://localhost:4000/pacientes");
        const data = await response.json();

        if (!response.ok || !data.success) {
            console.log("Error al cargar pacientes");
            return;
        }
        setPacientes(data.data);
    }, [fetchAuth]);


    const fetchMedicos = useCallback(async () => {
        const response = await fetchAuth("http://localhost:4000/medicos");
        const data = await response.json();

        if (!response.ok || !data.success) {
            console.log("Error al cargar médicos");
            return;
        }
        setMedicos(data.data);
    }, [fetchAuth]);

    useEffect(() => {
        fetchPacientes();
        fetchMedicos();
    }, [fetchPacientes, fetchMedicos]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores(null);

        const response = await fetchAuth("http://localhost:4000/turnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            setErrores(data.errores || [{ msg: data.message || "Error desconocido" }]);
            return;
        }

        navigate("/turnos");
    };

    return (
        <article>
            <h2>Crear Turno</h2>

            <form onSubmit={handleSubmit}>
                <fieldset>


                    <label>
                        Paciente
                        <select
                            required
                            value={values.paciente_id}
                            onChange={(e) =>
                                setValues({ ...values, paciente_id: e.target.value })
                            }
                        >
                            <option value="">Seleccionar paciente</option>
                            {pacientes.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.apellido} — DNI: {p.DNI}
                                </option>
                            ))}
                        </select>
                    </label>


                    <label>
                        Médico
                        <select
                            required
                            value={values.medico_id}
                            onChange={(e) =>
                                setValues({ ...values, medico_id: e.target.value })
                            }
                        >
                            <option value="">Seleccionar médico</option>
                            {medicos.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.nombre} {m.apellido} — {m.especialidad}
                                </option>
                            ))}
                        </select>
                    </label>


                    <label>
                        Fecha
                        <input
                            type="date"
                            required
                            value={values.fecha}
                            onChange={(e) =>
                                setValues({ ...values, fecha: e.target.value })
                            }
                        />
                    </label>


                    <label>
                        Hora
                        <input
                            type="time"
                            required
                            value={values.hora}
                            onChange={(e) =>
                                setValues({ ...values, hora: e.target.value })
                            }
                        />
                    </label>


                    <label>
                        Estado
                        <select
                            value={values.estado}
                            onChange={(e) =>
                                setValues({ ...values, estado: e.target.value })
                            }
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                            <option value="atendido">Atendido</option>
                        </select>
                    </label>


                    <label>
                        Observaciones
                        <textarea
                            value={values.observaciones}
                            onChange={(e) =>
                                setValues({ ...values, observaciones: e.target.value })
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

                <input type="submit" value="Crear Turno" />
            </form>
        </article>
    );
};
