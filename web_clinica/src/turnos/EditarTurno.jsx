import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth";

export const EditarTurno = () => {
    const { id } = useParams();
    const { fetchAuth } = useAuth();

    const [turno, setTurno] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [errores, setErrores] = useState([]);

    // ---- Obtener turno ----
    const fetchTurno = useCallback(async () => {
        const response = await fetchAuth(`http://localhost:4000/turnos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            setErrores(data.errors || [data.message]);
            return;
        }

        const turnoData = data.data;
        turnoData.fecha = turnoData.fecha.split("T")[0];
        setTurno(turnoData);

    }, [fetchAuth, id]);

    // ---- Obtener listas ----
    const fetchListas = useCallback(async () => {
        const resPac = await fetchAuth("http://localhost:4000/pacientes");
        const dataPac = await resPac.json();
        setPacientes(dataPac.data || []);

        const resMed = await fetchAuth("http://localhost:4000/medicos");
        const dataMed = await resMed.json();
        setMedicos(dataMed.data || []);
    }, [fetchAuth]);

    useEffect(() => {
        fetchTurno();
        fetchListas();
    }, [fetchTurno, fetchListas]);

    // ---- Actualizar turno ----
    const actualizar = async () => {
        setErrores([]);

        const response = await fetchAuth(`http://localhost:4000/turnos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(turno),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            setErrores(data.errors || [data.message]);
            return;
        }

        alert("Turno actualizado con éxito");
    };

    if (!turno) return <p>Cargando...</p>;

    return (
        <article>
            <h2>Editar Turno</h2>

            {errores.length > 0 && (
                <ul style={{ color: "red" }}>
                    {errores.map((e, i) => (
                        <li key={i}>{e}</li>
                    ))}
                </ul>
            )}

            {/* Paciente */}
            <label><b>Paciente</b></label>
            <select
                value={turno.paciente_id}
                onChange={(e) =>
                    setTurno({ ...turno, paciente_id: Number(e.target.value) })
                }
            >
                <option value="">Seleccione paciente</option>
                {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.nombre} {p.apellido}
                    </option>
                ))}
            </select>

            <br />

            {/* Médico */}
            <label><b>Médico</b></label>
            <select
                value={turno.medico_id}
                onChange={(e) =>
                    setTurno({ ...turno, medico_id: Number(e.target.value) })
                }
            >
                <option value="">Seleccione médico</option>
                {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.nombre} {m.apellido} – {m.especialidad}
                    </option>
                ))}
            </select>

            <br />

            {/* Fecha */}
            <label><b>Fecha:</b></label>
            <input
                type="date"
                value={turno.fecha}
                onChange={(e) => setTurno({ ...turno, fecha: e.target.value })}
            />

            <br />

            {/* Hora */}
            <label><b>Hora:</b></label>
            <input
                type="time"
                value={turno.hora}
                onChange={(e) => setTurno({ ...turno, hora: e.target.value })}
            />

            <br />

            {/* Estado */}
            <label><b>Estado:</b></label>
            <input
                type="text"
                value={turno.estado}
                onChange={(e) => setTurno({ ...turno, estado: e.target.value })}
            />

            <br />

            {/* Observaciones */}
            <label><b>Observaciones:</b></label>
            <textarea
                value={turno.observaciones || ""}
                onChange={(e) =>
                    setTurno({ ...turno, observaciones: e.target.value })
                }
            />

            <br /><br />

            <button onClick={actualizar}>Actualizar</button>
        </article>
    );
};
